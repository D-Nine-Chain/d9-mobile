import { Component, OnInit } from '@angular/core';
import { BurnMiningService } from 'app/services/contracts/burn-mining/burn-mining.service';
import { Account, BurnPortfolio } from 'app/types';
import { Utils } from 'app/utils/utils';
import { Subscription, first, forkJoin, from, map, switchMap } from 'rxjs';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from 'app/services/account/account.service';
import { LoadingController } from '@ionic/angular';
import { AssetsService } from 'app/services/asset/asset.service';
import { decode } from 'querystring';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { ReferralService } from 'app/services/referral/referral.service';
import { substrateAddressValidator } from 'app/utils/Validators';


@Component({
   selector: 'app-burn-portfolio',
   templateUrl: './burn-portfolio.component.html',
   styleUrls: ['./burn-portfolio.component.scss'],
})
export class BurnPortfolioComponent implements OnInit {
   burnableD9: number = 0;
   useOwnAddress: boolean = true;
   burnAmount = new FormControl(100, [Validators.required, Validators.min(100), this.multipleOf100Validator()]);
   beneficiary = new FormControl("", [Validators.required, substrateAddressValidator()]);
   networkBurned: number = 0;
   burnManagerBalance: number = 0;
   totalBurnedSub: Subscription | null = null;
   burnPortfolioSub: Subscription | null = null;
   dataSubs: Subscription | null = null;
   burnPortfolio: BurnPortfolio | null = null;
   parent: string = "";
   returnPercent: number = 0;
   baseExtraction: number = 0;
   referralBoost: number = 0;
   userAccount: Account | null = null;
   subs: Subscription[] = []
   currencySymbol = Utils.currenciesRecord["D9"].symbol;
   constructor(private burnMiningService: BurnMiningService, private accountService: AccountService, private loadingController: LoadingController, private assets: AssetsService, private referral: ReferralService) {
      this.subscribeToLiveData()
      this.referral.getParent()
         .then((parent) => {
            let decode = decodeAddress(parent);
            let encode = encodeAddress(decode);
            this.parent = encode;
         })


   }

   async ngOnInit() {

   }
   ngOnDestroy() {

   }
   //5DyM3yLyRrx1JpRXwjvm1dR3rF54P8S7hBY51TnPdgkWWtVS
   async burn() {
      if (this.burnAmount.valid && !this.useOwnAddress && this.beneficiary.valid) {
         const amount = this.burnAmount.value;
         const beneficiary = this.beneficiary.value!;
         this.burnMiningService.executeBurn(amount!, beneficiary)
      }
      else if (this.burnAmount.valid && this.useOwnAddress && this.userAccount) {
         const amount = this.burnAmount.value;
         const beneficiary = this.userAccount.address;
         this.burnMiningService.executeBurn(amount!, beneficiary)
      }


   }

   async withdraw() {
      console.log("withdraw called")
      this.burnMiningService.executeWithdraw()
   }

   /** 
    * @description a wrapper function that formats numbers for UI. reduces decimals, formats for region. 
    * */
   formatNumber(number: number) {
      return Utils.formatNumberForUI(number as number)
   }

   async subscribeToLiveData() {

      const loading = await this.loadingController.create({
         message: 'Loading...',
      })
      loading.present();
      const d9sub = this.assets.d9BalancesObservable()
         .subscribe((d9Balances) => {
            if (d9Balances) {
               console.log("d9 balances in component at subscription", d9Balances)
               this.burnableD9 = d9Balances.free as number;
            }
         })
      this.subs.push(d9sub)
      const networkSub = this.burnMiningService.getNetworkBurnObservable()
         .subscribe((burned) => {
            this.networkBurned = burned;
            console.log("burned in component is ", burned)
            if (burned > 0) {
               loading.dismiss();
            }
         })
      this.subs.push(networkSub)
      const portfolioSub = this.burnMiningService.getPortfolioObservable()
         .subscribe((portfolio) => {
            console.log("portfolio in component at subscription", portfolio)
            if (!portfolio && this.burnPortfolio != null) {
               this.burnPortfolio = null;
            }
            if (portfolio) {
               loading.dismiss();
               this.burnPortfolio = portfolio;
               this.burnMiningService.calculateBaseExtraction(this.burnPortfolio)
                  .then((baseExtraction) => {
                     this.baseExtraction = baseExtraction;
                     console.info(`expected dividends are ${baseExtraction}`)
                  })
               this.burnMiningService.calculateReferralBoost()
                  .then((referralBoost) => {
                     this.referralBoost = referralBoost;
                     console.info(`referral boost is ${this.referralBoost}`)
                  })
            }
         })
      const accountSub = this.accountService.getAccountObservable()
         .subscribe((account) => {
            console.log("account ", account)
            this.userAccount = account;
            this.burnPortfolio = null;
         })
      this.subs.push(accountSub)
      this.assets.getBurnManagerBalance()
         .then((balance) => {
            this.burnManagerBalance = balance.free as number
         })
      this.subs.push(portfolioSub)
      this.returnPercent = await this.burnMiningService.getReturnPercent();

   }

   calculateContributionPercentage() {
      if (this.networkBurned > 0 && this.burnPortfolio) {
         return this.burnPortfolio.amountBurned / this.networkBurned * 100;
      }
      else {
         return 0;
      }
   }

   toHumanDate(millisecondDate: number) {
      const date = new Date(millisecondDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      const day = date.getDate();

      // Get the time
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      // Format the month, day, hours, minutes, seconds for display
      const formattedMonth = month.toString().padStart(2, '0');
      const formattedDay = day.toString().padStart(2, '0');
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      // Construct the date-time string
      const dateTimeString = `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

      return dateTimeString;
   }

   unsubscribeToAll() {
      for (let sub of this.subs) {
         sub.unsubscribe();
      }
   }

   getBurnAmountErrorMessage() {
      if (this.burnAmount.hasError('required')) {
         return 'You must enter a value';
      } else if (this.burnAmount.hasError('min')) {
         return 'Insufficient amount (minimum is 100)';  // Example error for min validator
      } else if (this.burnAmount.hasError('notMultipleOf100')) {
         return 'Amount must be a multiple of 100';
      } else if (this.burnAmount.hasError('insufficientFunds')) {
         return 'Insufficient burnable d9';
      }
      return '';
   }

   disableBurnButton(): boolean {
      let balanceSufficient = false;
      if (this.burnAmount) {
         const balance = this.burnAmount.value ?? 0;
         balanceSufficient = balance <= this.burnableD9;
      }
      return !this.burnAmount.valid && balanceSufficient;
   }

   multipleOf100Validator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         return control.value % 100 === 0 ? null : { 'notMultipleOf100': { value: control.value } };
      };
   }

   onToggleChange(event: any) {
      const isChecked = event.detail.checked;
      if (isChecked) {
         this.useOwnAddress = true;
      }
      else {
         this.useOwnAddress = false;
      }
   }

   balanceValidator(balance: number): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         return balance > control.value ? null : { 'insufficientFunds': { value: control.value } };
      };
   }
}
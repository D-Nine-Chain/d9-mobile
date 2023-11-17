import { Component, OnInit } from '@angular/core';
import { BurnMiningService } from 'app/services/contracts/burn-mining/burn-mining.service';
import { BurnPortfolio } from 'app/types';
import { Utils } from 'app/utils/utils';
import { Subscription, first, forkJoin, from, map, switchMap } from 'rxjs';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from 'app/services/account/account.service';
import { LoadingController } from '@ionic/angular';
import { AssetsService } from 'app/services/asset/asset.service';


@Component({
   selector: 'app-burn-mining',
   templateUrl: './burn-mining.component.html',
   styleUrls: ['./burn-mining.component.scss'],
})
export class BurnMiningComponent implements OnInit {
   burnableD9: number = 0;
   burnAmount = new FormControl(100, [Validators.required, Validators.min(100), this.multipleOf100Validator()]);
   networkBurned: number = 0;
   totalBurnedSub: Subscription | null = null;
   burnPortfolioSub: Subscription | null = null;
   dataSubs: Subscription | null = null;
   burnPortfolio: BurnPortfolio | null = null;
   parent: string = "";
   returnPercent: number = 0;
   expectedDividends: number = 0;
   subs: Subscription[] = []
   currencySymbol = Utils.currenciesRecord["D9"].symbol;
   constructor(private burnMiningService: BurnMiningService, private accountService: AccountService, private loadingController: LoadingController, private assets: AssetsService) {
      this.subscribeToLiveData()
      this.assets.getParent()
         .then((parent) => {
            this.parent = parent;
         })
   }

   async ngOnInit() {

   }
   ngOnDestroy() {

   }

   async burn() {
      if (this.burnAmount.valid) {
         const amount = this.burnAmount.value;
         this.burnMiningService.executeBurn(amount!)
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
               this.burnableD9 = d9Balances.free;
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
            if (portfolio) {
               loading.dismiss();
               if (portfolio.balanceDue > 0) {
                  this.burnPortfolio = portfolio;
                  this.burnMiningService.calculateDividend(this.burnPortfolio)
                     .then((dividends) => {
                        this.expectedDividends = dividends;
                        console.info(`expected dividends are ${dividends}`)
                     })
               }
            }
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
      return new Date(millisecondDate).toLocaleDateString();
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

   balanceValidator(balance: number): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         return balance > control.value ? null : { 'insufficientFunds': { value: control.value } };
      };
   }
}
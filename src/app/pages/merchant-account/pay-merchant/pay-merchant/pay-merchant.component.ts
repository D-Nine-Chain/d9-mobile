import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AllowanceRequestComponent } from 'app/modals/allowance-request/allowance-request/allowance-request.component';
import { AssetsService } from 'app/services/asset/asset.service';
import { MerchantService } from 'app/services/contracts/merchant/merchant.service';
import { UsdtService } from 'app/services/contracts/usdt/usdt.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { USDTAllowanceRequest } from 'app/types';
import { substrateAddressValidator } from 'app/utils/Validators';
import { CurrencyTickerEnum } from 'app/utils/utils';
import { environment } from 'environments/environment';
import { filter, switchMap } from 'rxjs';

@Component({
   selector: 'app-pay-merchant',
   templateUrl: './pay-merchant.component.html',
   styleUrls: ['./pay-merchant.component.scss'],
})
export class PayMerchantComponent implements OnInit {
   amountToSend = new FormControl(1, [Validators.required, Validators.min(1)]);
   currency = new FormControl('USDT', [Validators.required]);
   currentModal: any = null;
   allowance: number = 0;
   merchantAddress: string | null = null;
   merchantExpiry: number | null = null;
   queryParams: any;
   countdown: string = '';
   d9Balance: number = 0;
   usdtBalance: number = 0;
   isValidMerchant = this.merchantExpiry ? (new Date().getTime() < this.merchantExpiry!) : false;
   subs: any[] = [];
   constructor(private asset: AssetsService, private usdt: UsdtService, private route: ActivatedRoute, merchant: MerchantService, private merchantService: MerchantService, public modalController: ModalController, private wallet: WalletService) { }

   ngOnInit() {
      this.queryParams = this.route.snapshot.queryParams;
      if (this.queryParams) {
         this.merchantAddress = this.queryParams.merchantAccount;
         this.merchantExpiry = this.queryParams.validUntil;
         if (this.merchantExpiry != null) {
            this.countdownToFutureDate(this.merchantExpiry!)
         }
      }
      let sub1 = this.asset.d9BalancesObservable().subscribe((balances) => {
         if (balances != null) {
            this.d9Balance = balances.free as number;
         }
      })
      this.subs.push(sub1);

      let sub2 = this.usdt.balanceObservable().subscribe((balance) => {
         if (balance != null) {
            this.usdtBalance = balance
         }
      })
      this.subs.push(sub2);
      let allowanceSub = this.usdt.allowanceObservable(environment.contracts.merchant.address)
         .subscribe((allowance) => {
            this.allowance = allowance;
         })
      this.subs.push(allowanceSub);
   }

   ngOnDestroy() {
      this.subs.forEach(sub => {
         sub.unsubscribe();
      })
   }

   disableButton() {
      if (!this.amountToSend.valid) {
         return true;
      }
      if (this.currency.value == "D9") {
         const inputMoreThanBalance = this.amountToSend!.value! > this.d9Balance;
         return inputMoreThanBalance;
      } else if (this.currency.value == "USDT") {
         const inputMoreThanBalance = this.amountToSend!.value! > this.usdtBalance;
         const inputMoreThanAllowance = this.amountToSend!.value! > this.allowance;
         return inputMoreThanBalance || inputMoreThanAllowance;
      }
      else {
         return false;
      }
   }

   async send() {
      console.log("buttons pressed")
      if (this.amountToSend.valid && this.merchantAddress) {
         console.log("conditions met")
         const amount = this.amountToSend.value;
         // this.asset.transferD9(this.merchantAddress, amount!)
         console.log("paying merchant")
         const ticker = this.currency.value == "D9" ? CurrencyTickerEnum.D9 : CurrencyTickerEnum.USDT;
         await this.merchantService.payMerchant(this.merchantAddress, amount!, ticker)
      }
   }
   async openAllowanceModal() {
      const data: USDTAllowanceRequest = {
         'address': environment.contracts.merchant.address,
         'name': environment.contracts.merchant.name,

      }
      await this.openModal(AllowanceRequestComponent, data)
   }
   async openModal(component: any, data?: any) {
      this.currentModal = await this.modalController.create({
         component: component,
      });
      if (data) {
         this.currentModal.componentProps = data;
      }
      return await this.currentModal.present();
   }
   validMerchant() {
      return this.merchantExpiry ? (new Date().getTime() < this.merchantExpiry!) : false;
   }

   countdownToFutureDate(futureDate: number) {
      const interval = setInterval(() => {
         const currentTime = new Date().getTime();
         const timeDifference = futureDate - currentTime;

         if (timeDifference <= 0) {
            clearInterval(interval);
            console.log('Countdown finished!');
            return;
         }
         // Calculate days, hours, minutes, and seconds
         const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
         const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
         const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
         this.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      }, 1000);
   }
}

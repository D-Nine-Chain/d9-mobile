import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { MerchantService } from 'app/services/contracts/merchant/merchant.service';
import { GreenPointsAccount } from 'app/types';
import { substrateAddressValidator } from 'app/utils/Validators';
import { Utils } from 'app/utils/utils';
import { Subscription, combineLatest, filter, forkJoin, switchMap } from 'rxjs';
import { MerchantQrComponent } from '../merchant-qr/merchant-qr.component';
import { UsdtService } from 'app/services/contracts/usdt/usdt.service';
import { AllowanceRequestComponent } from 'app/modals/allowance-request/allowance-request/allowance-request.component';
import { environment } from 'environments/environment';
import { WalletService } from 'app/services/wallet/wallet.service';

@Component({
   selector: 'app-merchant-account',
   templateUrl: './merchant-account.component.html',
   styleUrls: ['./merchant-account.component.scss'],
})
export class MerchantAccountComponent implements OnInit {

   merchantAccount: GreenPointsAccount = {
      greenPoints: 0,
      relationshipFactors: [0, 0],
      lastConversion: 0,
      redeemedUsdt: 0,
      redeemedD9: 0,
      createdAt: 0,
      expiry: 0,
   };
   expiry: number | null = null;
   countDownConfig = {
      format: 'HH:mm:ss',
      leftime: 100,
   }
   expirySub: Subscription | null = null;
   loading: any;
   countdown = "";
   currentModal: any = null;
   usdtBalance = 0;
   usdtAllowance = 0;

   numberOfMonths = new FormControl(0, [Validators.required, Validators.min(1), this.monthsValidator()]);
   amountToGreenPoints = new FormControl(1, [Validators.required, Validators.min(1)]);
   toAddress = new FormControl('', [Validators.required, substrateAddressValidator()]);
   accelerateRedPoints = 0;
   redPoints = 0;
   subs: Subscription[] = []
   constructor(private merchantService: MerchantService, private loadingController: LoadingController, public modalController: ModalController, private usdt: UsdtService, private wallet: WalletService) {
      let balanceAllowanceSub = combineLatest([this.usdt.allowanceObservable(environment.contracts.merchant.address),
      this.usdt.balanceObservable()])
         .subscribe(([allowance, balance]) => {
            console.log(`allowance is e is ${allowance} and balance is ${balance}`)
            if (allowance != null) {
               this.usdtAllowance = allowance;
               this.usdtBalance = balance;
            }
         })
      this.subs.push(balanceAllowanceSub)


      this.expirySub = this.merchantService.merchantExpiryObservable().subscribe((expiry) => {

         console.info("expiry is ", expiry)
         this.expiry = expiry
         if (this.expiry != null) {
            this.countdownToFutureDate(this.expiry)
         }

      })
   }
   showError() {
      if (this.numberOfMonths) {
         const errors = this.numberOfMonths.errors;

      }
   }
   async ngOnInit() {
      this.loading = await this.loadingController.create({
         message: "Loading..."
      })
      // this.loading.present();
   }
   ngOnDestroy() {
   }
   async openMerchantQrModal() {
      this.currentModal = await this.modalController.create({
         component: MerchantQrComponent,
      });
      return await this.currentModal.present();
   }

   async openAllowanceModal() {
      const data = {
         'forWho': environment.contracts.merchant.address,
      }
      await this.openModal(AllowanceRequestComponent, data)
   }

   async moreAllowance() {
      await this.openAllowanceModal();
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
   sendGreenPoints() {
      console.log("sending green points")
      if (this.amountToGreenPoints.valid && this.toAddress.valid) {
         const amount = this.amountToGreenPoints.value!;
         const address = this.toAddress.value!;
         this.merchantService.sendGreenPoints(address, amount)
      }
   }

   isMerchantAccount() {
      if (this.expiry != null) {
         return new Date(this.expiry).getTime() > Date.now()
      }
      return false;
   }

   generateMerchantCode() {
   }

   monthsValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         const months = control.value;
         return months * 10 > this.usdtAllowance ? { 'insufficientAllowance': { value: control.value } } : null;
      };
   }

   balanceValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         return this.usdtBalance > control.value ? null : { 'insufficientFunds': { value: control.value } };
      }
   }

   subscribe() {
      if (this.numberOfMonths.valid) {
         const months = this.numberOfMonths.value!;
         this.merchantService.subscribe(months);
      }
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


import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { MerchantMiningService } from 'app/services/contracts/merchant-mining/merchant-mining.service';
import { GreenPointsAccount } from 'app/types';
import { substrateAddressValidator } from 'app/utils/Validators';
import { Utils } from 'app/utils/utils';
import { Subscription } from 'rxjs';
import { MerchantQrComponent } from '../merchant-qr/merchant-qr.component';

@Component({
   selector: 'app-merchant-mining',
   templateUrl: './merchant-mining.component.html',
   styleUrls: ['./merchant-mining.component.scss'],
})
export class MerchantMiningComponent implements OnInit {

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
   merchantSub: Subscription | null = null;
   expirySub: Subscription | null = null;
   loading: any;
   countdown = "";
   numberOfMonths = new FormControl(0, [Validators.required, Validators.min(1)]);
   amountToGreenPoints = new FormControl(1, [Validators.required, Validators.min(1)]);
   toAddress = new FormControl('', [Validators.required, substrateAddressValidator()]);
   accelerateRedPoints = 0;
   redPoints = 0;
   constructor(private merchantMining: MerchantMiningService, private loadingController: LoadingController, public modalController: ModalController) {
      this.merchantSub = this.merchantMining.merchantAccountObservable().subscribe((merchantAccount) => {
         if (merchantAccount) {
            this.merchantAccount = merchantAccount
            this.redPoints = this.merchantMining.calcTimeFactor(merchantAccount)
            console.log("merchant account", merchantAccount)
            this.accelerateRedPoints = this.merchantMining.calcRelationshipFactor(merchantAccount)
            this.loading?.dismiss();
         }
      })
      this.expirySub = this.merchantMining.merchantExpiryObservable().subscribe((expiry) => {

         console.info("expiry is ", expiry)
         if (expiry != null) {
            this.expiry = expiry
            this.countdownToFutureDate(this.expiry)

         }
      })



   }

   async ngOnInit() {
      this.loading = await this.loadingController.create({
         message: "Loading..."
      })
      // this.loading.present();
   }
   ngOnDestroy() {
      this.merchantSub?.unsubscribe();
   }



   async openModal() {
      const modal = await this.modalController.create({
         component: MerchantQrComponent,
         // other modal options
      });
      return await modal.present();
   }
   sendGreenPoints() {
      console.log("sending green points")
      if (this.amountToGreenPoints.valid && this.toAddress.valid) {
         const amount = this.amountToGreenPoints.value!;
         const address = this.toAddress.value!;
         this.merchantMining.sendGreenPoints(address, amount)
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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { MerchantService } from 'app/services/contracts/merchant/merchant.service';
import { GreenPointsAccount } from 'app/types';
import { substrateAddressValidator } from 'app/utils/Validators';
import { Utils } from 'app/utils/utils';
import { Subscription } from 'rxjs';
import { MerchantQrComponent } from '../merchant-qr/merchant-qr.component';

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
   numberOfMonths = new FormControl(0, [Validators.required, Validators.min(1)]);
   amountToGreenPoints = new FormControl(1, [Validators.required, Validators.min(1)]);
   toAddress = new FormControl('', [Validators.required, substrateAddressValidator()]);
   accelerateRedPoints = 0;
   redPoints = 0;
   constructor(private merchantService: MerchantService, private loadingController: LoadingController, public modalController: ModalController) {

      this.expirySub = this.merchantService.merchantExpiryObservable().subscribe((expiry) => {

         console.info("expiry is ", expiry)
         this.expiry = expiry
         if (this.expiry != null) {
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

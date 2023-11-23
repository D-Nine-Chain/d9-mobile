import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { MerchantService } from 'app/services/contracts/merchant/merchant.service';
import { GreenPointsAccount } from 'app/types';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-green-account',
   templateUrl: './green-account.component.html',
   styleUrls: ['./green-account.component.scss'],
})
export class GreenAccountComponent implements OnInit {
   merchantAccount: GreenPointsAccount = {
      greenPoints: 0,
      relationshipFactors: [0, 0],
      lastConversion: 0,
      redeemedUsdt: 0,
      redeemedD9: 0,
      createdAt: 0,
      expiry: 0,
   };
   redPoints = 0;
   accelerateRedPoints = 0;

   //UI helpers
   loading: any;
   isGreenAccount: boolean = false;
   notGreenAccountMessage: string = '';
   greenPointsAccount: GreenPointsAccount | null = null;
   greenPointsAccountSub: Subscription | null = null;
   constructor(private merchantService: MerchantService) {
      this.greenPointsAccountSub = this.merchantService.greenPointsAccountObservable().subscribe((greenPointsAccount) => {
         console.log(`green points account is ${greenPointsAccount}`)
         if (greenPointsAccount) {
            this.isGreenAccount = true;
            this.greenPointsAccount = greenPointsAccount;
            this.redPoints = this.merchantService.calcTimeFactor(greenPointsAccount)
            this.accelerateRedPoints = this.merchantService.calcRelationshipFactor(greenPointsAccount)
         }
      });
   }

   ngOnInit() { }

   ngOnDestroy() {
   }

   withdraw() {
      console.log('withdraw started');

   }


}

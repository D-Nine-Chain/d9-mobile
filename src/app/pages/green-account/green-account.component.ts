import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AccountService } from 'app/services/account/account.service';
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
   };
   redPoints = 0;
   accelerateRedPoints = 0;

   //UI helpers
   loading: any;
   isGreenAccount: boolean = false;
   notGreenAccountMessage: string = '';
   greenPointsAccount: GreenPointsAccount | null = null;
   greenPointsAccountSub: Subscription | null = null;
   accountName: string = " ";
   accountAddress: string = " ";
   subs: Subscription[] = []
   constructor(private merchantService: MerchantService, private account: AccountService) {

   }

   ngOnInit() {
      let greenSub = this.greenPointsAccountSub = this.merchantService.greenAccountObservable().subscribe((greenAccount) => {
         console.log(`green points account is ${greenAccount}`)
         if (greenAccount == null && this.greenPointsAccount != null) {
            this.greenPointsAccount = null;

         }
         if (greenAccount) {
            console.log("green points are", greenAccount)
            this.isGreenAccount = true;
            this.greenPointsAccount = greenAccount;
            this.redPoints = this.merchantService.calcTimeFactor(greenAccount)
            this.accelerateRedPoints = this.merchantService.calcRelationshipFactor(greenAccount)
         }
      });
      this.subs.push(greenSub)

      let accountSub = this.account.getAccountObservable().subscribe((account) => {
         this.accountName = account.name
         this.accountAddress = account.address
      })
      this.subs.push(accountSub)
   }

   ngOnDestroy() {
      this.subs.forEach((sub) => {
         sub.unsubscribe()
      })
   }

   withdraw() {
      console.log('withdraw started');
      this.merchantService.withdrawD9().then(() => {
         console.log('withdraw complete');
      });
   }


}

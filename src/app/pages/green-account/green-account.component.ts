import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { MerchantMiningService } from 'app/services/contracts/merchant-mining/merchant-mining.service';
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
  merchantSub: Subscription | null = null;
  numberOfMonths = new FormControl(0, [Validators.required, Validators.min(1)]);
  amountToGreenPoints = new FormControl(1, [
    Validators.required,
    Validators.min(1),
  ]);
  redPoints = 0;
  accelerateRedPoints = 0;

  //UI helpers
  loading: any;
  isGreenAccount: boolean = false;
  notGreenAccountMessage: string = '';

  constructor(private merchantMining: MerchantMiningService) {
    this.merchantSub = this.merchantMining.merchantAccountObservable().subscribe((merchantAccount) => {
        if (merchantAccount) {
          this.merchantAccount = merchantAccount;
          this.redPoints = this.merchantMining.calcTimeFactor(merchantAccount);
          this.accelerateRedPoints = this.merchantMining.calcRelationshipFactor(merchantAccount);
          this.isGreenAccount = true;
        } else {
          this.isGreenAccount = false;
        }
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.merchantSub?.unsubscribe();
  }

  withdraw() {
    console.log('withdraw started');
    if (this.amountToGreenPoints.valid) {
      const amount = this.amountToGreenPoints.value!;
      this.merchantMining.withdrawD9(amount);
    }
  }

  subscribe() {
    if (this.numberOfMonths.valid) {
      const months = this.numberOfMonths.value!;
      this.merchantMining.subscribe(months);
    }
  }
}

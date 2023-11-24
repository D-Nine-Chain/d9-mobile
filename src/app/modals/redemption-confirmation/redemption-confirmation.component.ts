import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CurrencySymbol } from 'app/utils/utils';
import { MIN_BALANCE_MAP } from '../../../constants';

@Component({
  selector: 'app-redemption-confirmation',
  templateUrl: './redemption-confirmation.component.html',
  styleUrls: ['./redemption-confirmation.component.scss'],
})
export class RedemptionConfirmationComponent implements OnInit {
  baseCurrencySymbol = CurrencySymbol['GREEN_POINTS'];
  convertedCurrencySymbol = CurrencySymbol.USDT;
  baseCurrency = 'GP';
  convertedCurrency = 'USDT';
  currentAllowance: number = MIN_BALANCE_MAP['GREEN_POINTS'];
  pointsToRedeem = new FormControl(1, [
    Validators.required,
    Validators.min(1),
  ]);
  inputValue: number = 0
  @Input('baseCurrencyBalance') baseCurrencyBalance: number = 0;
  @Input('calculatedConversion') calculatedConversion: number | undefined = 0;
  @Input('withdraw') withdraw: any;

  constructor() {}
  subs: Subscription[] = [];
  ngOnInit() {}

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  insufficientBalance(): boolean {
    if (this.pointsToRedeem.value) {
      return this.baseCurrencyBalance < this.pointsToRedeem.value;
    }

    return false;
  }

  onConfirm () {
    this.withdraw()
  }

  fillMax() {
    this.inputValue = this.baseCurrencyBalance;
  }
}

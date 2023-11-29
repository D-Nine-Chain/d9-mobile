import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AssetsService } from 'app/services/asset/asset.service';
import { UsdtService } from 'app/services/contracts/usdt/usdt.service';
import { substrateAddressValidator } from 'app/utils/Validators';
import { CurrencySymbol, Utils } from 'app/utils/utils';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
   selector: 'app-send',
   templateUrl: './send.component.html',
   styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit {
   currencyChoice = new FormControl('D9', [Validators.required]);
   amountToSend = new FormControl(1, [Validators.required, Validators.min(1), this.balanceValidator()]);
   toAddress = new FormControl('', [Validators.required, Validators.min(1), substrateAddressValidator()]);
   usdtBalance: number = 0;
   d9Balance: number = 0;
   queryParams: any;
   d9CurrencySymbol = CurrencySymbol.D9;
   usdtCurrencySymbol = CurrencySymbol.USDT;
   subs: Subscription[] = [];
   constructor(private asset: AssetsService, private route: ActivatedRoute, private usdt: UsdtService) { }

   ngOnInit() {
      this.queryParams = this.route.snapshot.queryParams;
      if (this.queryParams) {
         this.toAddress.setValue(this.queryParams.address)
      }

      let usdtBalanceSub = this.usdt.balanceObservable().subscribe((usdtBalance) => {
         if (usdtBalance != null) {
            console.log("usdt balance is ", usdtBalance)
            this.usdtBalance = usdtBalance
         }
      })
      this.subs.push(usdtBalanceSub)

      let d9BalanceSub = this.asset.d9BalancesObservable().subscribe((d9Balances) => {
         if (d9Balances != null) {
            this.d9Balance = d9Balances.free as number
            this.amountToSend.updateValueAndValidity();
         }
      })
      this.subs.push(d9BalanceSub)

      this.currencyChoice.valueChanges.subscribe((currency) => {
         this.amountToSend.updateValueAndValidity();
      })
   }

   formatNumber(number: number) {
      return Utils.formatNumberForUI(number, "long", "standard")
   }

   ngOnDestroy() {
      this.subs.forEach((sub) => {
         sub.unsubscribe()
      })
   }

   send() {
      if (this.amountToSend.valid && this.toAddress.valid) {
         const address = this.toAddress.value;
         const amount = this.amountToSend.value;
         if (this.currencyChoice.value == "USDT") {
            this.usdt.transfer(address!, amount!)
         } else if (this.currencyChoice.value == "D9") {
            this.asset.transferD9(address!, amount!)
         }

      }
   }

   balanceValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         console.log(`currency choice ${this.currencyChoice.value}`)
         if (this.currencyChoice.value == "USDT") {
            return this.usdtBalance > control.value ? null : { 'insufficientFunds': { value: control.value } };
         }
         else if (this.currencyChoice.value == "D9") {
            return this.d9Balance > control.value ? null : { 'insufficientFunds': { value: control.value } };
         }
         else {
            return { 'insufficientFunds': { value: control.value } }
         }
      }
   }
}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AmmService } from 'app/services/amm/amm.service';

import { AssetsService } from 'app/services/asset/asset.service';
import { D9Balances, LiquidityProvider } from 'app/types';
import { Utils } from 'app/utils/utils';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-swap',
   templateUrl: './swap.component.html',
   styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit {
   swapAmount = new FormControl(1, [Validators.required, Validators.min(1), this.sufficientBalanceValidator()])

   d9Balances: D9Balances = {
      available: '',
      free: 0,
      reserved: '',
      locked: '',
      vested: '',
      voting: ''
   }


   swapSub: Subscription | null = null;
   constructor(private assets: AssetsService, private amm: AmmService, private router: Router) {
      this.assets.d9BalancesObservable().subscribe((d9Balances) => {
         console.log("balances in swap", d9Balances)
         this.d9Balances = d9Balances

      })

      this.amm.currencyReservesObservable().subscribe((reserves) => {
         console.log("reserves", reserves)
      });
   }

   ngOnInit() { }
   swap() {
      console.log("swap called")
      if (this.swapAmount.valid) {
         const amount = this.swapAmount.value;
         // this.router.navigate(['/home'])
      }
   }

   formatNumber(number: number | string) {
      if (number) {
         return Utils.formatNumberForUI(number as number)
      }
      else {
         return 0
      }
   }

   sufficientBalanceValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         console.log("is sufficient balance", this.isBalanceSufficient())
         return this.isBalanceSufficient() ? null : { 'insufficient D9 Balance': { value: control.value } };
      }
   }
   navigateTo(path: string) {
      this.router.navigate([path])
   }
   isBalanceSufficient(): boolean {
      if (this.swapAmount) {
         if (this.swapAmount.value !== null) {
            return this.swapAmount.value <= (this.d9Balances.free as number)
         }
         else {
            return false
         }
      }
      else {
         return false;
      }
   }
}

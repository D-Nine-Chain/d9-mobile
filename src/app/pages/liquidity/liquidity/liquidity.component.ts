import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { AssetsService } from 'app/services/asset/asset.service';
import { LiquidityProvider } from 'app/types';
import { Utils } from 'app/utils/utils';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-liquidity',
   templateUrl: './liquidity.component.html',
   styleUrls: ['./liquidity.component.scss'],
})
export class LiquidityComponent implements OnInit {
   usdtLiquidity = new FormControl(1, [Validators.required, Validators.min(1)])
   d9Liquidity = new FormControl(1, [Validators.required, Validators.min(1), this.balanceValidator()])
   allowance = new FormControl(100, [Validators.required, Validators.min(100)]);
   liquidityProvider: LiquidityProvider | null = null;
   d9Reserves: number = 0;
   usdtReserves: number = 0;
   currentAllowance: number = 0;
   d9Balance: number = 0;
   usdtBalance: number = 0;
   subs: Subscription[] = []
   constructor(private assets: AssetsService) {
      this.assets.getLiquidityProviderObservable().subscribe((liquidityProvider) => {
         console.log("liquidity provider", liquidityProvider)
      })
      this.assets.getUsdtAllowance
   }

   ngOnInit() {
      let lpSub = this.assets.getLiquidityProviderObservable()
         .subscribe((liquidityProvider) => {
            if (liquidityProvider) {
               this.liquidityProvider = liquidityProvider
            }
         })
      this.subs.push(lpSub)
      let reservesSub = this.assets.getCurrencyReservesObservable()
         .subscribe((reserves) => {
            console.log("reserves", reserves)
            if (reserves && reserves.length > 0) {
               this.d9Reserves = reserves[0]
               this.usdtReserves = reserves[1]
            }
         })
      this.subs.push(reservesSub)
      let usdtBalanceSub = this.assets.getUsdtBalanceObservable()
         .subscribe((usdtBalance) => {
            this.usdtBalance = usdtBalance
         })
      this.subs.push(usdtBalanceSub)
      this.assets.getUsdtAllowance()
         .then((allowance) => {
            console.log(`usdt allowance is ${allowance}`);
            if (allowance) {
               this.currentAllowance = allowance
            }
         })
         .catch((err) => {
            console.log("error getting usdt allowance", err)
         })

      let d9sub = this.assets.d9BalancesObservable()
         .subscribe((d9Balances) => {
            console.log("d9 balances", d9Balances)
            this.d9Balance = d9Balances.free
         })
   }
   haveNoAllowance() {
      return this.currentAllowance == 0
   }
   ngOnDestroy() {
      this.subs.forEach((sub) => {
         sub.unsubscribe()
      })
   }
   addLiquidity() {
      if (this.usdtLiquidity.valid && this.d9Liquidity.valid) {
         const usdtAmount = this.usdtLiquidity.value;
         const d9Amount = this.d9Liquidity.value;
         this.assets.addLiquidity(usdtAmount!, d9Amount!)
            .then((result) => {
               console.log("add liquidity result", result)
            })
         // .catch((err) => {
         //    console.log("add liquidity error", err)
         // })
      }
   }
   async addAllowance() {
      if (this.allowance.valid) {
         const amount = this.allowance.value;
         await this.assets.approveUsdt(amount!)
         this.assets.getUsdtAllowance()
            .then((allowance) => {
               if (allowance) {
                  this.currentAllowance = allowance
               }
            })
      }
   }
   formatNumber(number: string | number) {
      return Utils.formatNumberForUI(number as number)
   }
   conditionsNotMet(): boolean {
      return !(this.usdtLiquidity.valid && this.d9Liquidity.valid)
   }
   removeLiquidity() { }
   balanceValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         return this.d9Balance > control.value ? null : { 'insufficientFunds': { value: control.value } };
      };
   }
}

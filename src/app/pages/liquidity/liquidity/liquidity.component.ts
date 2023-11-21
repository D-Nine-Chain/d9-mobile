import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { AmmService } from 'app/services/amm/amm.service';
import { AssetsService } from 'app/services/asset/asset.service';
import { UsdtService } from 'app/services/usdt/usdt.service';
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
   constructor(private assets: AssetsService, private amm: AmmService, private usdt: UsdtService) {
      let lpSub = this.amm.liquidityProviderObservable()
         .subscribe((liquidityProvider) => {
            console.info("liquidity provider in liquidity component", liquidityProvider)
            if (liquidityProvider != null) {
               this.liquidityProvider = liquidityProvider
            }
         })
      this.subs.push(lpSub)

      this.amm.currencyReservesObservable()
         .subscribe((reserves) => {
            console.log("reserves in liquidity component", reserves)
            if (reserves) {
               this.d9Reserves = reserves[0]
               this.usdtReserves = reserves[1]
            }
         })

      // this.subs.push(reservesSub)

      let usdtBalanceSub = this.usdt.usdtBalanceObservable()
         .subscribe((usdtBalance) => {
            console.log(`usdt balance in liquidity component is ${usdtBalance}`)
            if (usdtBalance) {
               this.usdtBalance = usdtBalance
            }
         })
      this.subs.push(usdtBalanceSub)

      const allowanceSub = this.usdt.allowanceObservable().subscribe((allowance) => {
         console.log("allwoance in liquidity component", allowance)
         if (allowance != null) {
            console.log(`allowances is ${allowance}`)
            this.currentAllowance = allowance
         }
      })
      this.subs.push(allowanceSub)

      let d9sub = this.assets.d9BalancesObservable()
         .subscribe((d9Balances) => {
            this.d9Balance = d9Balances.free
         })
      this.subs.push(d9sub)
   }

   ngOnInit() {

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
         this.amm.addLiquidity(usdtAmount!, d9Amount!)
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
         await this.usdt.approveUsdt(amount!)

      }
   }
   formatNumber(number: string | number) {
      return Utils.formatNumberForUI(number as number)
   }
   conditionsNotMet(): boolean {
      return !(this.usdtLiquidity.valid && this.d9Liquidity.valid)
   }
   removeLiquidity() {
      if (this.liquidityProvider) {
         if (this.liquidityProvider.d9 != 0 && this.liquidityProvider.usdt != 0) {
            this.amm.removeLiquidity()
         }
      }
   }
   balanceValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         return this.d9Balance > control.value ? null : { 'insufficientFunds': { value: control.value } };
      };
   }
}

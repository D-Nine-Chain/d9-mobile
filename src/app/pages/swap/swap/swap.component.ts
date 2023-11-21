import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AmmService } from 'app/services/amm/amm.service';

import { AssetsService } from 'app/services/asset/asset.service';
import { UsdtService } from 'app/services/usdt/usdt.service';
import { CurrencyInfo, D9Balances, LiquidityProvider } from 'app/types';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-swap',
   templateUrl: './swap.component.html',
   styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit {
   d9Reserves: number = 0;
   usdtReserves: number = 0;
   fromBalance: number | string = 0;
   selectedSwap: string = 'D9_USDT';
   swapToValue: number = 0;
   fromAmount: number = 0;
   toAmount: number = 0;
   fromCurrency: CurrencyInfo = Utils.getCurrencyInfo(CurrencyTickerEnum.D9);
   toCurrency: CurrencyInfo = Utils.getCurrencyInfo(CurrencyTickerEnum.USDT);
   swapAmount = new FormControl(1, [Validators.required, Validators.min(1)])
   swapFrom = new FormControl('D9', [Validators.required])
   d9Balances: D9Balances = {
      available: '',
      free: 0,
      reserved: '',
      locked: '',
      vested: '',
      voting: ''
   }
   usdtBalance: number = 0;
   swapSub: Subscription | null = null;
   constructor(private assets: AssetsService, private amm: AmmService, private router: Router, private usdt: UsdtService) {
      this.assets.d9BalancesObservable().subscribe((d9Balances) => {
         console.log("balances in swap", d9Balances)
         this.d9Balances = d9Balances
         this.fromBalance = d9Balances.free

      })
      this.usdt.usdtBalanceObservable().subscribe((usdtBalance) => {
         this.usdtBalance = usdtBalance
      })

      this.amm.currencyReservesObservable().subscribe((reserves) => {
         if (reserves) {
            console.log("getting new reserves ")
            this.d9Reserves = reserves[0]
            this.usdtReserves = reserves[1]
         }
      });
   }

   ngOnInit() {
      this.fromCurrency = Utils.getCurrencyInfo(CurrencyTickerEnum.D9);
      this.toCurrency = Utils.getCurrencyInfo(CurrencyTickerEnum.USDT);
      this.fromBalance = this.d9Balances.free;
   }

   async swap() {
      console.log("swap called")
      if (this.swapAmount.valid) {
         console.log("swap amount is valid")
         const amount = this.swapAmount.value;
         let swap = {
            from: this.fromCurrency.ticker,
            to: this.toCurrency.ticker,
            fromAmount: amount!,
         }
         await this.amm.swap(swap)
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
            console.log("this from balance is ", this.d9Balances.free)
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

   getCurrentBalanceString() {
      console.log("this from balance is ", this.fromBalance)
      return `your current ${this.fromCurrency.name} balance is ${this.fromBalance}`
   }

   calcToAmount() {
      if (this.swapAmount.value) {
         const amount = this.swapAmount.value
         const price = this.calculatePrice()
         const result = amount * price
         return result;

      } else {
         return 0
      }
   }

   calculatePrice() {

      const swapDirection = this.selectedSwap;
      const d9Reserves = this.d9Reserves;
      const usdtReserves = this.usdtReserves;
      let price = 0;

      if (swapDirection === 'USDT_D9') {
         if (d9Reserves === 0 || usdtReserves === 0) {
            return 0;
         }
         price = d9Reserves / usdtReserves;

      } else if (swapDirection === 'D9_USDT') {
         if (d9Reserves === 0 || usdtReserves === 0) {
            return 0;
         }
         price = usdtReserves / d9Reserves;
      }
      return price;
   }

   onSelectChange(event: any) {
      // const selection = 
      this.selectedSwap = event.target.value;
      if (this.selectedSwap.startsWith('USDT')) {
         this.setCurrenciesForSwap(CurrencyTickerEnum.USDT, CurrencyTickerEnum.D9)
      } else {
         this.setCurrenciesForSwap(CurrencyTickerEnum.D9, CurrencyTickerEnum.USDT);
      }
   }
   setCurrenciesForSwap(from: CurrencyTickerEnum, to: CurrencyTickerEnum) {
      console.log("from to ", from, to)
      this.fromBalance = from === CurrencyTickerEnum.D9 ? this.d9Balances.free : this.usdtBalance;
      console.log("this from balance ins set currency swap", this.fromBalance)
      this.fromCurrency = Utils.getCurrencyInfo(from);
      this.toCurrency = Utils.getCurrencyInfo(to);
   }
}

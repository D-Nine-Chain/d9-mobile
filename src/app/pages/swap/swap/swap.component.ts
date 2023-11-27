import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AllowanceRequestComponent } from 'app/modals/allowance-request/allowance-request/allowance-request.component';
import { AmmService } from 'app/services/contracts/amm/amm.service';

import { AssetsService } from 'app/services/asset/asset.service';
import { UsdtService } from 'app/services/contracts/usdt/usdt.service';
import { CurrencyInfo, D9Balances, LiquidityProvider } from 'app/types';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { Subscription } from 'rxjs';
import { ConfirmationComponent } from 'app/modals/swap/confirmation/confirmation.component';
import { environment } from 'environments/environment';

@Component({
   selector: 'app-swap',
   templateUrl: './swap.component.html',
   styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit {
   currentModal: any = null;;
   usdtAllowance: number = 0;
   d9Reserves: number = 0;
   usdtReserves: number = 0;
   fromBalance: number | string = 0;
   selectedSwap: string = 'D9_USDT';
   swapToValue: number = 0;
   fromAmount: number = 0;
   toAmount: number = 0;
   errorText: string | null = null;;
   @Input() fromCurrency: CurrencyInfo = Utils.getCurrencyInfo(CurrencyTickerEnum.D9);
   toCurrency: CurrencyInfo = Utils.getCurrencyInfo(CurrencyTickerEnum.USDT);
   swapAmount = new FormControl(1, [Validators.required, Validators.min(1), this.swapValidator()]);
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
   subs: Subscription[] = []
   constructor(private assets: AssetsService, private amm: AmmService, private router: Router, private usdt: UsdtService, public modalController: ModalController) {
      let d9Sub = this.assets.d9BalancesObservable().subscribe((d9Balances) => {
         if (d9Balances != null) {
            this.d9Balances = d9Balances
            this.fromBalance = d9Balances.free
            this.swapAmount.updateValueAndValidity();
         }
      })
      this.subs.push(d9Sub)
      let usdtSub = this.usdt.usdtBalanceObservable().subscribe((usdtBalance) => {
         this.usdtBalance = usdtBalance
      })
      this.subs.push(usdtSub)
      let reservesSub = this.amm.currencyReservesObservable().subscribe((reserves) => {
         if (reserves) {
            this.d9Reserves = reserves[0]
            this.usdtReserves = reserves[1]
         }
      });
      this.subs.push(reservesSub)

      let allowanceSub = this.usdt.allowanceObservable(environment.contracts.amm.address).subscribe((allowance) => {
         if (allowance != null) {
            this.usdtAllowance = allowance
         }

      })
      this.subs.push(allowanceSub)
   }


   async ngOnInit() {
      this.fromCurrency = Utils.getCurrencyInfo(CurrencyTickerEnum.D9);
      this.toCurrency = Utils.getCurrencyInfo(CurrencyTickerEnum.USDT);
      this.fromBalance = this.d9Balances.free;

   }

   navigateTo(path: string) {
      this.router.navigate([path])
   }

   async openAllowanceModal() {
      await this.openModal(AllowanceRequestComponent)
   }

   async openModal(component: any) {
      this.currentModal = await this.modalController.create({
         component: component,
      });
      return await this.currentModal.present();
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
         // await this.amm.swap(swap)
         // this.router.navigate(['/home'])
         // not using openModal is custom modal
         this.currentModal = await this.modalController.create({
            component: ConfirmationComponent,
            componentProps: swap,
            breakpoints: [0, 2],
            initialBreakpoint: 1,
            handle: false,
         });
      }


      return await this.currentModal.present();
   }

   formatNumber(number: number | string) {
      if (number) {
         return Utils.formatNumberForUI(number as number)
      }
      else {
         return 0
      }
   }

   disableSwap() {
      if (!this.swapAmount.valid) {
         return true;
      }
      if (this.fromCurrency.ticker === CurrencyTickerEnum.D9) {
         return this.disableD9Swap();
      }
      else if (this.fromCurrency.ticker === CurrencyTickerEnum.USDT) {
         return this.disableUSDTSwap();
      } else {
         return true;
      }
   }

   disableD9Swap() {
      return false;
   }

   disableUSDTSwap() {
      return false;
   }

   // sufficientBalanceValidator(): ValidatorFn {
   //    return (control: AbstractControl): { [key: string]: any } | null => {
   //       console.log("is sufficient balance", this.isBalanceSufficient())
   //       return this.isBalanceSufficient() ? null : { 'insufficient D9 Balance': { value: control.value } };
   //    }
   // }

   swapValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         return this.isInvalidSwap(control);
      }
   }

   isInvalidSwap(control: AbstractControl): ValidationErrors | null {

      if (this.fromCurrency.ticker === CurrencyTickerEnum.D9) {
         console.log(`control value is ${control.value} and from balance is ${this.fromBalance}`)
         const insufficientBalance = control.value > (this.fromBalance as number);
         if (insufficientBalance) {
            return this.constructError('Insufficient D9 balance', control);
         }
      }
      else if (this.fromCurrency.ticker === CurrencyTickerEnum.USDT) {
         const insufficientBalance = control.value > (this.usdtBalance as number);
         const insufficientReserves = control.value > (this.usdtReserves as number);
         const insufficientAllowance = control.value > (this.usdtAllowance as number);

         if (insufficientBalance) {
            return this.constructError('Insufficient USDT balance', control);
         } else if (insufficientReserves) {
            return this.constructError('Insufficient USDT reserves', control);
         } else if (insufficientAllowance) {

            return this.constructError('Insufficient USDT allowance', control);
         }
      }
      return null;
   }

   constructError(errorMessage: string, control: AbstractControl): ValidationErrors {
      return { ['customError']: { message: errorMessage, value: control.value } };
   }

   isBalanceSufficient(): boolean {
      console.log("checking if balance is sufficient")
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

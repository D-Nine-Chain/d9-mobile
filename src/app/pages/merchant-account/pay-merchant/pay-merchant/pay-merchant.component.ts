import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AssetsService } from 'app/services/asset/asset.service';
import { MerchantService } from 'app/services/contracts/merchant/merchant.service';
import { UsdtService } from 'app/services/contracts/usdt/usdt.service';
import { substrateAddressValidator } from 'app/utils/Validators';

@Component({
   selector: 'app-pay-merchant',
   templateUrl: './pay-merchant.component.html',
   styleUrls: ['./pay-merchant.component.scss'],
})
export class PayMerchantComponent implements OnInit {
   amountToSend = new FormControl(1, [Validators.required, Validators.min(1)]);
   // toAddress = new FormControl('', [Validators.required, Validators.min(1), substrateAddressValidator()]);
   merchantAddress: string | null = null;
   merchantExpiry: number | null = null;
   currencyChoice = "D9"
   queryParams: any;
   countdown: string = '';
   d9Balance: number = 0;
   usdtBalance: number = 0;
   isValidMerchant = this.merchantExpiry ? (new Date().getTime() < this.merchantExpiry!) : false;
   subs: any[] = [];
   constructor(private asset: AssetsService, private usdt: UsdtService, private route: ActivatedRoute, merchant: MerchantService, private merchantService: MerchantService) { }

   ngOnInit() {
      this.queryParams = this.route.snapshot.queryParams;
      if (this.queryParams) {
         this.merchantAddress = this.queryParams.merchantAccount;
         this.merchantExpiry = this.queryParams.validUntil;
         if (this.merchantExpiry != null) {
            this.countdownToFutureDate(this.merchantExpiry!)
         }
      }
      let sub1 = this.asset.d9BalancesObservable().subscribe((balances) => {
         if (balances != null) {
            this.d9Balance = balances.free as number;
         }
      })
      this.subs.push(sub1);

      let sub2 = this.usdt.balanceObservable().subscribe((balance) => {
         if (balance != null) {
            this.usdtBalance = balance
         }
      })
      this.subs.push(sub2);
   }

   ngOnDestroy() {
      this.subs.forEach(sub => {
         sub.unsubscribe();
      })
   }
   async send() {
      if (this.amountToSend.valid && this.merchantAddress) {
         const amount = this.amountToSend.value;
         // this.asset.transferD9(this.merchantAddress, amount!)
         console.log("paying merchant")
         await this.merchantService.payMerchantD9(this.merchantAddress, amount!)
      }
   }

   validMerchant() {
      return this.merchantExpiry ? (new Date().getTime() < this.merchantExpiry!) : false;
   }

   countdownToFutureDate(futureDate: number) {
      const interval = setInterval(() => {
         const currentTime = new Date().getTime();
         const timeDifference = futureDate - currentTime;

         if (timeDifference <= 0) {
            clearInterval(interval);
            console.log('Countdown finished!');
            return;
         }
         // Calculate days, hours, minutes, and seconds
         const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
         const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
         const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
         this.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      }, 1000);
   }
}

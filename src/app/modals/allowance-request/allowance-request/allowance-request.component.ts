import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UsdtService } from 'app/services/contracts/usdt/usdt.service';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-allowance-request',
   templateUrl: './allowance-request.component.html',
   styleUrls: ['./allowance-request.component.scss'],
})
export class AllowanceRequestComponent implements OnInit {
   currentAllowance: number = 0;
   usdtBalance: number = 0;
   allowanceToAdd = new FormControl(1, [Validators.required, Validators.min(1), this.balanceValidator()]);
   constructor(private modalControl: ModalController, private usdt: UsdtService) { }
   subs: Subscription[] = [];
   ngOnInit() {
      let usdtSub = this.usdt.usdtBalanceObservable().subscribe((usdtBalance) => {
         if (usdtBalance != null) {
            this.usdtBalance = usdtBalance
         }
      })
      this.subs.push(usdtSub)
      let allowanceSub = this.usdt.allowanceObservable().subscribe((allowance) => {
         if (allowance != null) {
            this.currentAllowance = allowance
         }
      })
      this.subs.push(allowanceSub)
   }

   ngOnDestroy() {
      this.subs.forEach((sub) => {
         sub.unsubscribe()
      })
   }


   insufficietBalance(): boolean {
      if (this.allowanceToAdd.value) {
         return this.usdtBalance < this.allowanceToAdd.value;
      }
      return true;
   }

   increaseAllowance() {
      if (this.allowanceToAdd.valid) {
         this.usdt.approveUsdt(this.allowanceToAdd.value!)
            .then(() => {
               this.modalControl.dismiss()
            })
      }
   }

   balanceValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         console.log(`balance is ${this.usdtBalance} and control value is ${control.value}`)
         return this.usdtBalance > control.value ? null : { 'insufficientFunds': { value: control.value } };
      }
   }
}

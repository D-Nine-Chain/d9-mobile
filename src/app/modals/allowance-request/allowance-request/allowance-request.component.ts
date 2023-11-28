import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { UsdtService } from 'app/services/contracts/usdt/usdt.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { USDTAllowanceRequest } from 'app/types';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-allowance-request',
   templateUrl: './allowance-request.component.html',
   styleUrls: ['./allowance-request.component.scss'],
})
export class AllowanceRequestComponent implements OnInit {
   currentAllowance: number = 0;
   usdtBalance: number = 0;
   activeAddress: string = '';
   requesterName: string = '';
   allowanceToAdd = new FormControl(1, [Validators.required, Validators.min(1), this.balanceValidator()]);
   constructor(private modalControl: ModalController, private usdt: UsdtService, private navParams: NavParams, private wallet: WalletService) { }
   subs: Subscription[] = [];
   requestData: USDTAllowanceRequest = this.navParams.data as USDTAllowanceRequest
   ngOnInit() {

      let usdtSub = this.usdt.balanceObservable().subscribe((usdtBalance) => {
         this.usdtBalance = usdtBalance
      })
      this.subs.push(usdtSub)
      console.log(`allowance request for ${this.requestData.address}`)
      let allowanceSub = this.usdt.allowanceObservable(this.requestData.address).subscribe((allowance) => {
         if (allowance != null) {
            this.currentAllowance = allowance
         }
         // this.modalControl.getTop().then((top) => {
         //    if (top) {
         //       this.modalControl.dismiss()
         //    }
         // })
      })
      this.subs.push(allowanceSub)
   }

   ngOnDestroy() {
      this.subs.forEach((sub) => {
         sub.unsubscribe()
      })
   }


   insufficientBalance(): boolean {
      if (this.allowanceToAdd.value) {
         return this.usdtBalance < this.allowanceToAdd.value;
      }
      return true;
   }

   increaseAllowance() {
      if (this.allowanceToAdd.valid) {
         // this.usdt.setAllowance(this.requestData.address, this.allowanceToAdd.value!)
         //    .then(() => {
         //       this.modalControl.dismiss()
         //    })
         this.usdt.increaseAllowance(this.requestData.address, this.allowanceToAdd.value!)
            .then(() => {
               this.modalControl.dismiss()
            })
      }
   }

   balanceValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         return this.usdtBalance >= control.value ? null : { 'insufficientFunds': { value: control.value } };

      }
   }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'app/services/account/account.service';
import { Account } from 'app/types';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-account-management',
   templateUrl: './account-management.component.html',
   styleUrls: ['./account-management.component.scss'],
})
export class AccountManagementComponent implements OnInit {
   subs: Subscription[] = []
   addressSet: Set<string> | null = null;
   accounts: Account[] = [];
   newAccountName = new FormControl('', [Validators.required, Validators.minLength(1)]);
   constructor(private account: AccountService, private router: Router) {
      this.subscribeToLiveData()
   }

   ngOnInit() { }
   ngOnDestroy() {
      this.subs.forEach((sub) => {
         sub.unsubscribe()
      })
   }
   switchTo(account: Account) {
      console.log("switching to account ", account)
      this.account.switchToAccount(account)
      this.router.navigate(['/home'])
      // this.account.switchToAddress(address)
   }
   async addAccount() {
      console.log("adding new account", this.newAccountName.value)
      if (this.newAccountName.valid) {
         console.log("name is valid")
         const name = this.newAccountName.value;
         await this.account.makeNewAccount(name!)
         this.newAccountName.reset()
      }
   }
   subscribeToLiveData() {
      const sub1 = this.account.getAddresses()
         .subscribe((addresses: Set<string>) => {
            this.addressSet = addresses
            this.accounts = []
            console.log("addresses", addresses)
            this.addressSet.forEach((address) => {
               this.account.getAccountMetadata(address).then((metadata) => {
                  console.log("account metadata in account management", metadata)
                  this.accounts.push({ address: address, name: metadata.name || "default" })
               })
            })
         })
      this.subs.push(sub1)
   }
   validName() {
      return !this.newAccountName.valid
   }
}

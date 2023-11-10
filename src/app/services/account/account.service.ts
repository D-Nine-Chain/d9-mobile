import { Injectable } from '@angular/core';
import { WalletService } from '../wallet/wallet.service';
import { Account } from 'app/types';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { cryptoWaitReady } from '@polkadot/util-crypto';
/**
 * @description let an account be the metadata for the child nodes a HD wallet
 */
@Injectable({
   providedIn: 'root'
})
export class AccountService {

   accountSubject = new BehaviorSubject<Account>({ address: "", name: "" });

   constructor(private wallet: WalletService) {
      cryptoWaitReady()
         .then(() => { })
      this.wallet.getAddress()
      this.accountSubject.next({ address: this.wallet.getAddress(), name: "default" })
   }
   // todo convert this to a flat map thing
   public getAccountObservable(): Observable<Account> {
      return this.wallet.addressObservable.pipe(map((address: string) => {
         return { address: address, name: "default" }
      }))

   }

   public getAccount(): Account {
      return this.accountSubject.getValue();
   }


}

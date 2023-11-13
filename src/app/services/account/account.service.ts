import { Injectable } from '@angular/core';
import { WalletService } from '../wallet/wallet.service';
import { Account } from 'app/types';
import { BehaviorSubject, Observable, Subscription, combineLatest, firstValueFrom, map } from 'rxjs';
import { cryptoWaitReady } from '@polkadot/util-crypto';
/**
 * @description let an account be the metadata for the child nodes a HD wallet
 */
@Injectable({
   providedIn: 'root'
})
export class AccountService {

   accountSubject = new BehaviorSubject<Account>({ address: "", name: "" });
   addressSubscription: Subscription | null = null;
   constructor(private wallet: WalletService) {

      this.addressSubscription = this.wallet.getActiveAddressObservable().subscribe((address) => {

      })
      // this.accountSubject.next({ address: this.wallet.getAddressObservable(), name: "default" })
   }
   // todo convert this to a flat map thing
   public getAccountObservable(): Observable<Account> {
      return this.wallet.getActiveAddressObservable().pipe(map((address: string) => {
         return { address: address, name: "default" }
      }))

   }

   public getAccount(): Promise<Account> {
      return firstValueFrom(this.getAccountObservable());
   }


}

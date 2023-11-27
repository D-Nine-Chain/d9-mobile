import { Injectable } from '@angular/core';
import { WalletService } from '../wallet/wallet.service';
import { Account } from 'app/types';
import { BehaviorSubject, Observable, Subscription, combineLatest, filter, firstValueFrom, from, map, switchMap, tap } from 'rxjs';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeyringPair$Meta } from '@polkadot/keyring/types';
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

      this.addressSubscription = this.wallet.activeAddressObservable().subscribe((address) => {

      })
      // this.accountSubject.next({ address: this.wallet.getAddressObservable(), name: "default" })
   }
   // todo convert this to a flat map thing
   public getAccountObservable(): Observable<Account> {
      return this.wallet.activeAddressObservable().pipe(
         filter(address => address != null),
         switchMap((address) => {
            return from(this.getAccountMetadata(address!))
               .pipe(map((meta) => {
                  return { address: address!, name: meta.name || "default" }
               })
                  , tap((account) => {
                     console.log("get account observable", account)
                  }
                  )
               )
         })
      )
      // return this.accountSubject.asObservable().pipe(
      //    filter(
      //       (account) => {
      //          return account.address != ""
      //       }
      //    ),
      //    switchMap((account) => {
      //       console.log("address in the pipe", account)
      //       return from(this.getAccountMetadata(account.address))
      //          .pipe(map((meta) => {
      //             account.name = meta.name || "default"
      //             return account
      //          })
      //             , tap((account) => {
      //                console.log("get account observable", account)
      //             }
      //             )
      //          )
      //    })
      // )
   }

   public async getAccountMetadata(address: string): Promise<KeyringPair$Meta> {
      return this.wallet.getKeyMetadata(address);
   }

   public switchToAccount(account: Account) {
      this.wallet.updateActiveAddress(account.address)
   }

   public async makeNewAccount(name: string): Promise<Account> {
      console.log("making enw account")
      const address = await this.wallet.deriveNewKey(name)
      return { address: address, name: name }
   }

   public getAccount(): Promise<Account> {
      return firstValueFrom(this.getAccountObservable());
   }

   public async changeActiveAccount(address: string) {
      this.wallet.updateActiveAddress(address);
   }



   public getAddresses(): Observable<Set<string>> {
      return this.wallet.getAllAddressesObservable();
   }

   public updateActiveAccount(account: Account) {
      this.accountSubject.next(account)
   }


}

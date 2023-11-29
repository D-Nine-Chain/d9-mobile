import { Injectable } from '@angular/core';
import { D9ApiService } from '../d9-api/d9-api.service';
import { WalletService } from '../wallet/wallet.service';
import { Observable, firstValueFrom, from, map, switchMap } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class ReferralService {

   constructor(private d9: D9ApiService, private wallet: WalletService) { }
   getDirectReferrals() {
      return this.wallet.activeAddressObservable()
         .pipe(
            switchMap(address =>
               from(this.d9.getApiPromise()).pipe(
                  switchMap(d9 =>
                     d9.query['d9Referral']['directReferralsCount'](address)
                  ),
                  map((count) => {
                     return count.toJSON()
                  })
               ))
         );
   }

   getParent(): Promise<string> {
      const observable$ = this.wallet.activeAddressObservable().pipe(
         switchMap(account =>
            from(this.d9.getApiPromise()).pipe(
               switchMap(d9 => from((d9.rpc as any).referral.getParent(account)))

            ).pipe(


            )
         ),
      );

      return firstValueFrom(observable$ as Observable<string>);
   }

   public getDirectReferralsCount() {
      return this.wallet.activeAddressObservable()
         .pipe(
            switchMap(address =>
               from(this.d9.getApiPromise()).pipe(
                  switchMap(d9 =>
                     from((d9.rpc as any).referral.getDirectReferralsCount(address))
                  )
               )
            )
         );
   }

   getAncestors() {
      return this.wallet.activeAddressObservable()
         .pipe(switchMap(
            async (account) => {
               const d9 = await this.d9.getApiPromise();
               return await (d9.rpc as any).referral.getAncestors(account)
            }
         ),

         )
   }

}

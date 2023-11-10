import { Injectable } from '@angular/core';
import { VoidFn } from '@polkadot/api/types';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { Observable } from 'rxjs';
@Injectable({
   providedIn: 'root'
})
export class D9BalancesService {
   d9BalancesSub: VoidFn | null = null;
   constructor(private d9: D9ApiService) { }

   connectToD9BalancesSub(address: string): Observable<any> {
      console.log("getting balance");

      return new Observable(subscriber => {
         this.d9.getAPI().then(d9 => {
            d9.query.system.account(address, (rawData) => {
               let accountInfo = rawData.toJSON() as any;
               console.log("balances data is ", accountInfo)
               subscriber.next({
                  free: accountInfo.data.free,
                  reserved: accountInfo.data.reserved,
                  frozen: accountInfo.data.frozen
               });
            }).then(unsub => {
               // Store the unsubscribe function if you need to unsubscribe later
               this.d9BalancesSub = unsub;
            });
         }).catch(error => subscriber.error(error));
      });
   }
}

import { Injectable } from '@angular/core';
import { VoidFn } from '@polkadot/api/types';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { D9Balances } from 'app/types';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { Observable, firstValueFrom, from, map, switchMap } from 'rxjs';
@Injectable({
   providedIn: 'root'
})
export class D9BalancesService {
   d9BalancesSub: VoidFn | null = null;
   constructor(private d9: D9ApiService) { }

   d9BalancesObservable(address: string): Observable<any> {

      console.log("getting balance");
      const d9 = from(this.d9.getApi());
      return d9.pipe(
         switchMap(api =>
            api.derive.balances.all(address).pipe(
               map(balanceInfo => {
                  console.log("balance info is ", balanceInfo);
                  return this.formatBalances(balanceInfo);
               })
            )
         ),
      );
   }
   private formatBalances(balanceInfo: any): D9Balances {
      let formattedBalances: Record<string, any> = {
         free: balanceInfo.freeBalance.toString(),

         reserved: balanceInfo.reservedBalance.toString(),
         locked: balanceInfo.lockedBalance.toString(),
         vested: balanceInfo.vestedBalance.toString(),
         voting: balanceInfo.votingBalance.toString(),
         available: balanceInfo.availableBalance.toString()
      }
      for (const balance in formattedBalances) {
         formattedBalances[balance] = Utils.reduceByCurrencyDecimal(formattedBalances[balance], CurrencyTickerEnum.D9)
      }
      return formattedBalances as D9Balances;
   }
}

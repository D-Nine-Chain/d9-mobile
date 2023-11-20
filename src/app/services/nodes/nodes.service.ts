import { Injectable } from '@angular/core';
import { D9ApiService } from '../d9-api/d9-api.service';
import { BehaviorSubject, filter, firstValueFrom, from, map, switchMap } from 'rxjs';
import { WalletService } from '../wallet/wallet.service';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable({
   providedIn: 'root'
})

export class NodesService {
   unsubs: any[] = [];
   constructor(private d9: D9ApiService, private wallet: WalletService, private transaction: TransactionsService) { }
   validators: BehaviorSubject<string[]> = new BehaviorSubject<any>([]);
   currentTransactionSub: any;
   public getSessionValidators() {
      const api = this.d9.getApi();
      // return api.query.staking.validators()

      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.queryMulti(
                  [
                     d9.query.session.validators
                  ]
               )
            ),
            map(result => {
               return {
                  validators: result[0].toJSON()
               }
            })
         )
   }
   // public 
   public getActiveEra() {
      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.query.staking.activeEra()
            ),
            map(result => {
               return result.toJSON()
            })
         )
   }

   public async bondTokens(amount: number) {
      console.log(`bonding ${amount}`)
      const formattedAmount = Utils.toBigNumberString(amount, CurrencyTickerEnum.D9)
      const api = await this.d9.getApi();
      // d9.tx.staking.bond(formattedAmount, address)
      const address = await firstValueFrom(this.wallet.getActiveAddressObservable()
         .pipe(filter(
            address => address != null
         ))
      )
      console.log("address on bond tokens is ", address)
      const tx = (api.tx['staking']['bond'] as any)(address!, formattedAmount, 'Stash')
      console.log("tx is", tx)
      const signedTx = await this.wallet.signTransaction(tx)
      this.currentTransactionSub = this.transaction.sendSignedTransaction(signedTx)
         .subscribe((result) => {
            if (result.status.isFinalized) {
               this.currentTransactionSub.unsubscribe();
            }
         })
   }

   public getEraStakers() {
      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.query.staking.erasStakers(0, '5DAv93yptzLKRrWJveVo6eetiexmxaGPWGdxnGPQrcJEp1rW')
            ),
            map(result => {
               return result.toJSON()
            })
         )
   }
}
export type ActiveEra = {
   index: number,
   // timestap milliseconds
   start: number
}
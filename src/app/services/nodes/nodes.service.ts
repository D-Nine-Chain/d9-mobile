import { Injectable } from '@angular/core';
import { D9ApiService } from '../d9-api/d9-api.service';
import { BehaviorSubject, filter, firstValueFrom, forkJoin, from, map, switchMap, tap } from 'rxjs';
import { WalletService } from '../wallet/wallet.service';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { TransactionsService } from '../transactions/transactions.service';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { SessionOverview } from 'app/types';

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



   public getHealth() {
      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.rpc.system.health()
            )
         )
   }
   public test() {
      this.getNominators().subscribe((result) => {
         console.log("nominators ", result)
      })
      this.getHealth().subscribe((result) => {
         console.log("health is ", result.toHuman())
      })

      // this.getValidatorsInfo().subscribe((result) => {
      //    console.log("validator info ", result)
      // })
      this.getSessionValidators().subscribe((result) => {
         console.log("session validators ", result)
      })
   }

   public getNominators() {
      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.query.staking.nominators.keys()
            )
         )
   }

   public validatorInfo() {
      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.query.staking.validators('ytBPqMwQPfbs9ugGHadMUjQk6VBRNWe9cRBtqPSX4eEdQR8')
            )
         )
   }

   public getEpochInfo() {
      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.derive.session.info()
            )
         )
   }


   public getValidatorsInfo() {
      this.getSessionValidators()
         .pipe(
            tap((result) => console.log("session validators ", result)),
            switchMap(
               (result: any) => {
                  const validators = result.validators.map((validator: any) => {

                  });
                  return result
               }
            ),
         )

   }


   public getValidatorsAddresses() {
      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.query.staking.validators.keys()
            )
         )
   }

   public getOverview() {
      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.derive.staking.overview()
                  .pipe(
                     map(result => {
                        const overView = {
                           activeEra: result.activeEra.toJSON(),
                           activeEraStart: result.activeEraStart.toJSON(),
                           currentEra: result.currentEra.toJSON(),
                           currentIndex: result.currentIndex.toJSON(),
                           nextElected: result.nextElected.map((validator) => { return encodeAddress(decodeAddress(validator)) }),
                           validatorCount: result.validatorCount.toJSON(),
                           validators: result.validators.map((validator) => { return encodeAddress(decodeAddress(validator)) })
                        } as SessionOverview
                        return overView;
                     })
                  )
            )
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
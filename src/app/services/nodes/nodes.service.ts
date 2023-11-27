import { Injectable } from '@angular/core';
import { D9ApiService } from '../d9-api/d9-api.service';
import { BehaviorSubject, Observable, filter, firstValueFrom, forkJoin, from, map, switchMap, tap } from 'rxjs';
import { WalletService } from '../wallet/wallet.service';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { TransactionsService } from '../transactions/transactions.service';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { CommissionPreference, LedgerInfo, NodeInfo, Nominations, SessionOverview } from 'app/types';

@Injectable({
   providedIn: 'root'
})

export class NodesService {
   unsubs: any[] = [];
   constructor(private d9: D9ApiService, private wallet: WalletService, private transaction: TransactionsService) {

   }
   validators: BehaviorSubject<string[]> = new BehaviorSubject<any>([]);
   currentNode: BehaviorSubject<any> = new BehaviorSubject<any>(null);
   currentTransactionSub: any;

   public getSessionValidators() {
      const api = this.d9.getApi();
      // return api.query.staking.validators()
      this.currentNode.next("5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY")
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
               const data = result.map((data) => { return data.toString() })
               console.log("validator data is  ", data)
               return {
                  validators: result[0].toJSON()
               }
            })
         )
   }

   public getNodeInfo(address: string): Observable<NodeInfo> {
      console.log(`getting node info for ${address}`)
      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.queryMulti(
                  [
                     [d9.query.staking.validators, address],
                     [d9.query.staking.bonded, address],
                     [d9.query.staking.nominators, address],
                     [d9.query.staking.ledger, address],
                     [d9.query.staking.erasValidatorPrefs, [40, address]],
                     [d9.query.staking.erasValidatorReward, 40],
                  ]
               )
            ),
            map(result => {
               // console.log("result is ", result)
               const data = result.map((data) => { return data.toJSON() })

               const nodeInfo: NodeInfo = {
                  address: address,
                  bondedAccount: data[1] as string,
                  preferredNominations: (data[2] as any) as Nominations,
                  ledger: (data[3] as any) as LedgerInfo,
                  preferences: (data[0] as any) as CommissionPreference,
                  erasRewards: data[5]
               }
               return this.formatNodeInfo(nodeInfo)
            })
         )
   }

   setCurrentNode(address: string) {
      this.currentNode.next(address)
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

   }
   public eraValidatorPrefs() {
      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.query.staking.erasValidatorPrefs(0, '5DAv93yptzLKRrWJveVo6eetiexmxaGPWGdxnGPQrcJEp1rW')
            ),
            map(result => {
               return result.toJSON()
            })
         )
   }

   public getNominators() {
      return from(this.d9.getApi())
         .pipe(
            switchMap(
               d9 => d9.query.staking.nominators.keys()
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

   formatNodeInfo(nodeInfo: any) {
      const ledger = nodeInfo.ledger;
      ledger.active = Utils.reduceByCurrencyDecimal(ledger.active, CurrencyTickerEnum.D9)
      ledger.total = Utils.reduceByCurrencyDecimal(ledger.total, CurrencyTickerEnum.D9)
      const formattedNodeInfo = {
         address: nodeInfo.address,
         bondedAccount: nodeInfo.bondedAccount,
         preferredNominations: nodeInfo.preferredNominations,
         ledger: nodeInfo.ledger,
         preferences: nodeInfo.preferences,
         erasRewards: nodeInfo.erasRewards
      }
      return formattedNodeInfo;
   }
}
export type ActiveEra = {
   index: number,
   // timestap milliseconds
   start: number
}
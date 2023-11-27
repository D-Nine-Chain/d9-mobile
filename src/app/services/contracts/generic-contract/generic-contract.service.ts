import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, firstValueFrom, filter, first, from, switchMap, tap, Observable, Subject, take, of, combineLatest, map, defer } from 'rxjs';
import { TransactionsService } from 'app/services/transactions/transactions.service';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { ContractCallOutcome } from 'app/utils/api-contract/types';
import { SubmittableExtrinsic } from '@polkadot/api/types/submittable';

/**
 * @description this is a generic contract service that is used to interact with the blockchain 
* 
 */
@Injectable({
   providedIn: 'root'
})
export class GenericContractServiceBase {

   private managerSubject: { [key: string]: BehaviorSubject<any> } = {};
   protected onChainData: { [key: string]: BehaviorSubject<any> } = {};
   protected currentTransactionSub: Subscription | null = null;
   protected observablesInitializedSubject = new Subject<boolean>();
   constructor(protected wallet: WalletService, protected transaction: TransactionsService, protected d9: D9ApiService) {

   }

   /**
    * @description should be only public facing. this is called by components to get the observable
    * @param key 
    * @returns 
    */
   // protected getObservable<T>(key: string): Observable<T | null> {
   //    console.log(`getting observable for ${key}`)
   //    return this.observablesInitializedSubject.asObservable().pipe(
   //       filter(initialized => initialized === true),
   //       // take(1),
   //       switchMap(() => this.onChainData[key].asObservable() as Observable<T>,
   //       ),
   //       tap(data => console.log(`tapped observable for ${key} with ${data}`)),
   //    );
   // }
   protected getObservable<T>(key: string) {
      return defer(() => {
         if (!this.onChainData?.[key]) {
            return of(null);
         }
         return this.onChainData[key].asObservable();
      }).pipe(
         tap(
            data => console.log(`tapped observable for ${key} with ${data}`)
         )
      );


   }

   /**
    * @description executes arbitrary write transactions
    * @param methodName the name of the contract method. 
    * @param args contract method arguments
    * @param updatePromises data to pull from chain to update after successful run of contract
    */
   protected async sendWriteTransaction(tx: SubmittableExtrinsic<'rxjs'>, updatePromises?: Promise<any>[]): Promise<void> {
      console.log("executing write transaction called")
      this.currentTransactionSub = from(this.wallet.signTransaction(tx)).pipe(
         switchMap(signedTx => {
            return from(this.transaction.sendSignedTransaction(signedTx)).pipe(
               tap(async (result) => {
                  if (result.status.isFinalized) {
                     if (updatePromises) {
                        console.log("executing update promises")
                        await Promise.all(updatePromises);
                        this.currentTransactionSub?.unsubscribe();
                     }
                  }
               })
            );
         })
      ).subscribe();

   }

   protected getAddressObservable(): Observable<string | null> {
      return this.wallet.activeAddressObservable();
   }

   protected getAddressPromise(): Promise<string | null> {
      return firstValueFrom(this.wallet.activeAddressObservable().pipe(
         filter(address => address !== null),
         first()
      ));
   }

   /**
    * @description initializes the manager for the contract
    */
   protected async initManager<T>(contractName: string): Promise<any> {
      let manager: any = await this.d9.getContract(contractName);
      return manager;
   }
   /**
    * @description initializes the observable data, updateds on the service onChainData object
    * @param key 
    * @param data 
    */
   protected initObservable<T>(key: string, data: T) {
      this.onChainData[key] = new BehaviorSubject<T>(data);
   }
   /**
    * @description updates observable data for subscribers
    * @param key 
    * @param data 
    */
   private async updateObservable<T>(key: string, data: T) {
      console.log(`updating observable for ${key} with : ${data}`)
      if (!this.onChainData[key]) {
         this.onChainData[key] = new BehaviorSubject<T>(data);
      }
      this.onChainData[key].next(data);
   }


   protected async getManager<T>(managerKey: string): Promise<T> {
      return firstValueFrom(this.managerSubject[managerKey].asObservable().pipe(
         filter(manager => manager !== null),
         first()
      ));
   }




}

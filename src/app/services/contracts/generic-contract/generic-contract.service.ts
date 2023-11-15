import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, firstValueFrom, filter, first, from, switchMap, tap, Observable, of, Subject, take } from 'rxjs';
import { TransactionsService } from 'app/services/transactions/transactions.service';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { MerchantManager } from 'app/contracts/merchant-manager/merchant-manager';
import { ContractCallOutcome } from 'app/utils/api-contract/types';

/**
 * @description this is a generic contract service that is used to interact with the blockchain 
* 
 */
@Injectable({
   providedIn: 'root'
})
export class GenericContractService {

   private managerSubject: BehaviorSubject<any> = new BehaviorSubject<any | null>(null);
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
   protected getObservable<T>(key: string): Observable<T | null> {
      return this.observablesInitializedSubject.asObservable().pipe(
         filter(initialized => initialized === true),
         take(1),
         switchMap(() => this.onChainData[key].asObservable() as Observable<T>)
      );
   }

   /**
    * @description executes arbitrary write transactions
    * @param methodName the name of the contract method. 
    * @param args contract method arguments
    * @param updatePromises data to pull from chain to update after successful run of contract
    */
   protected async executeWriteTransaction(methodName: string, args: any[], updatePromises?: Promise<any>[]): Promise<void> {
      this.currentTransactionSub = from(this.getManager<any>()).pipe(
         switchMap(manager => {
            const tx = manager[methodName](...args);
            return from(this.wallet.signContractTransaction(tx)).pipe(
               switchMap(signedTx => {
                  return from(this.transaction.sendSignedTransaction(signedTx)).pipe(
                     tap(async (result) => {
                        if (result.status.isFinalized) {
                           if (updatePromises) {
                              console.log("executing update promises")
                              // await Promise.all(updatePromises);
                           }
                        }
                     })
                  );
               })
            );
         }),
      ).subscribe();
   }
   /**
    * @description gets promise based data from contract and updates observable to subscribers
    * @param key key (name) value of observable in the onChainData object
    * @param fetchMethod the function of the manager to call to get said data
    * @param formatData a method used to format data for the subscribers
    */
   protected async updateDataFromChain<T>(key: string, fetchMethod: Promise<ContractCallOutcome>, formatData?: (data: any) => T) {
      let manager = await this.getManager<MerchantManager>();
      const { output, result } = await fetchMethod;
      if (result.isOk && output != null) {
         let data = (output.toJSON() as any).ok;

         if (data.ok && formatData) {
            data = formatData(data.ok);
            this.updateObservable<T>(key, data);
         }
         else if (data.err) {
            this.updateObservable(key, data);
         }


      }
   }
   /**
    * @description initializes the manager for the contract
    */
   protected async initManager<T>(contractName: string): Promise<any> {
      let manager = await this.d9.getContract(contractName);
      this.updateManager(manager)
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
      if (!this.onChainData[key]) {
         this.onChainData[key] = new BehaviorSubject<T>(data);
      }
      this.onChainData[key].next(data);
   }


   protected async getManager<T>(): Promise<T> {
      return firstValueFrom(this.managerSubject.asObservable().pipe(
         filter(manager => manager !== null),
         first()
      ));
   }

   private updateManager<T>(manager: T) {
      this.managerSubject.next(manager);
   }





}

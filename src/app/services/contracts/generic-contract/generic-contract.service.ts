import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, firstValueFrom, filter, first, from, switchMap, tap, Observable } from 'rxjs';

import { TransactionsService } from 'app/services/transactions/transactions.service';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { environment } from 'environments/environment';
import { WalletService } from 'app/services/wallet/wallet.service';

/**
 * @description this is a generic contract service that is used to interact with the blockchain 
* 
 */
@Injectable({
   providedIn: 'root'
})
export class GenericContractService {
   private managerSubjects: { [key: string]: BehaviorSubject<any | null> } = {};
   private onChainData: { [key: string]: BehaviorSubject<any> } = {};
   private currentTransactionSub: Subscription | null = null;

   constructor(protected wallet: WalletService, protected transaction: TransactionsService, protected d9: D9ApiService) {

   }

   protected async initService(managerKey: string, promises: Promise<any>[]): Promise<void> {
      try {

         await Promise.all(promises)
      } catch (err) {
         console.log("error in prepping contract ", err)
      }
   }
   /**
    * @description should be only public facing. this is called by components to get the observable
    * @param key 
    * @returns 
    */
   protected getObservable<T>(key: string): Observable<T> {
      return this.onChainData[key].asObservable() as Observable<T>;
   }

   protected async executeTransaction(contractKey: string, methodName: string, args: any[]): Promise<void> {
      this.currentTransactionSub = from(this.getManager<any>(contractKey)).pipe(
         switchMap(manager => {
            const tx = manager[methodName](...args);
            return from(this.wallet.signContractTransaction(tx)).pipe(
               switchMap(signedTx => {
                  return from(this.transaction.sendSignedTransaction(signedTx)).pipe(
                     tap(async (result) => {
                        if (result.status.isFinalized) {

                        }
                     })
                  );
               })
            );
         }),
      ).subscribe();
   }

   protected async updateDataFromChain<T>(key: string, fetchMethod: (manager: any) => Promise<any>, formatData?: (data: any) => T) {
      let manager = await this.getManager<any>(key);
      const { output, result } = await fetchMethod(manager);

      if (result.isOk && output != null) {
         let data = output.toJSON() as any;
         console.log(data);

         if (data && formatData) {
            data = formatData(data);
         }

         this.updateObservable(key, data);
      }
   }

   protected async initManager<T>(contractName: string): Promise<any> {
      let manager = await this.d9.getContract(contractName);
      this.updateManager(contractName, manager)
      return manager;
   }

   private async updateObservable<T>(key: string, data: T) {
      this.onChainData[key].next(data);
   }

   protected async getManager<T>(key: string): Promise<T> {
      console.log(`Getting ${key} manager`);
      return firstValueFrom(this.managerSubjects[key].asObservable().pipe(
         filter(manager => manager !== null),
         first()
      ));
   }

   private updateManager<T>(key: string, manager: T) {
      console.log(`${key} manager is`, manager);
      this.managerSubjects[key].next(manager);
   }





}

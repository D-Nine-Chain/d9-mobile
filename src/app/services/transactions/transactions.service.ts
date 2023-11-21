import { Injectable } from '@angular/core';
import { SubmittableExtrinsic } from '@polkadot/api/types/submittable';
import { ISubmittableResult } from '@polkadot/types/types';
import { BehaviorSubject, Observable, Subscription, catchError, from, tap, throwError } from 'rxjs';
import { NotificationService } from '../notification/notification.service';
import { ContractCallOutcome } from 'app/utils/api-contract/types';

@Injectable({
   providedIn: 'root'
})
export class TransactionsService {
   private transactionResultSub: BehaviorSubject<ISubmittableResult | null> = new BehaviorSubject<ISubmittableResult | null>(null);
   constructor(private notification: NotificationService) { }
   public currentTransactionSub: Subscription | null = null;
   public sendSignedTransaction(transaction: SubmittableExtrinsic<'rxjs', ISubmittableResult>): Observable<ISubmittableResult> {
      console.log("sending signed transactions");

      // Convert the Promise returned by `send` to an Observable
      return from(transaction.send()).pipe(
         tap(result => {
            this.processWriteOutcomes(result);

         }),
         catchError(err => {
            console.error("Error sending transaction:", err);
            return throwError(err); // or handle the error as appropriate
         })
      );

   }
   /**
    * 
    * @param callOutcome 
    * @param dataFormatter 
    * @note in this project this is generally used for read only transactions even if `ContractCallOutcome` is also used in write based transactions
    * @returns 
    */
   public processReadOutcomes<T>(callOutcome: ContractCallOutcome, dataFormatter: (data: any) => T): T | null {
      console.log("processing contract read call", callOutcome)
      if (callOutcome.result.isOk) {
         const contractResponse = (callOutcome.output!.toJSON()! as any).ok
         console.log("contract response is ", contractResponse)
         if (contractResponse != null) {
            return dataFormatter(contractResponse);
         }
      }
      return null;
   }

   private processWriteOutcomes(result: ISubmittableResult): void {
      console.log("processing result", result.status)
      this.notification.transactionNotification(result);
      console.log("processing result")
      if (result.status.isInBlock) {
         this.transactionResultSub.next(result);
         console.log(`Transaction included in block: ${result.status.asInBlock}`);
      } else if (result.status.isFinalized) {
         this.transactionResultSub.next(result);
         this.currentTransactionSub?.unsubscribe();
         console.log(`Transaction finalized in block: ${result.status.asFinalized}`);
      } else if (result.status.isBroadcast) {
         this.transactionResultSub.next(result);
         console.log('Transaction has been broadcasted');
      } else if (result.status.isReady) {
         console.log('Transaction is ready');
      } else if (result.status.isFuture) {
         console.log('Transaction is scheduled for a future block');
      }

      // Check for dispatch error
      if (result.dispatchError) {
         // sendNotification("error", "", `${JSON.stringify(result.dispatchError.toHuman())}`)
         this.currentTransactionSub?.unsubscribe();
         this.transactionResultSub.next(result);
         result.events.forEach((e) => {
            console.log(e.toJSON())
         })
         console.log("transaction result is ", result.toHuman())
      }
   }
}

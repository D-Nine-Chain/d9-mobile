import { Injectable } from '@angular/core';
import { SubmittableExtrinsic } from '@polkadot/api/types/submittable';
import { ISubmittableResult } from '@polkadot/types/types';
import { BehaviorSubject, Observable, catchError, from, tap, throwError } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class TransactionsService {
   private transactionResultSub: BehaviorSubject<ISubmittableResult | null> = new BehaviorSubject<ISubmittableResult | null>(null);
   constructor() { }

   public sendSignedTransaction(transaction: SubmittableExtrinsic<'rxjs', ISubmittableResult>): Observable<ISubmittableResult> {
      console.log("sending signed transactions");

      // Convert the Promise returned by `send` to an Observable
      return from(transaction.send()).pipe(
         tap(result => {
            console.log("result from sending signed");
            console.log(result.toHuman());
         }),
         catchError(err => {
            console.error("Error sending transaction:", err);
            return throwError(err); // or handle the error as appropriate
         })
      );
   }


   private processResult(result: ISubmittableResult): void {
      console.log("processing result")
      if (result.status.isInBlock) {
         this.transactionResultSub.next(result);
         console.log(`Transaction included in block: ${result.status.asInBlock}`);
      } else if (result.status.isFinalized) {
         this.transactionResultSub.next(result);
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
         this.transactionResultSub.next(result);
         result.events.forEach((e) => {
            console.log(e.toJSON())
         })
         console.log("transaction result is ", result.toHuman())
      }
   }
}

import { Injectable } from '@angular/core';
import { SubmittableExtrinsic } from '@polkadot/api/types/submittable';
import { ISubmittableResult } from '@polkadot/types/types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class TransactionsService {
   private transactionResultSub: BehaviorSubject<ISubmittableResult | null> = new BehaviorSubject<ISubmittableResult | null>(null);
   constructor() { }
   public getTransactionResultSub() {
      return this.transactionResultSub.asObservable();
   }

   public async sendSignedTransaction(transaction: SubmittableExtrinsic<"promise", ISubmittableResult>): Promise<any> {
      transaction.send(this.processResult)
   }


   private processResult(result: ISubmittableResult): void {
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

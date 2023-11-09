import { Injectable } from '@angular/core';
import { TransactionsService } from '../transactions/transactions.service';
import { BehaviorSubject } from 'rxjs';
import { Notification, NotificationType, TransactionStatusMessage } from 'app/types';

@Injectable({
   providedIn: 'root'
})
export class NotificationService {
   private notificationSub: BehaviorSubject<any> = new BehaviorSubject<Notification[]>([]);

   private toastSub: BehaviorSubject<Notification | null> = new BehaviorSubject<Notification | null>(null);

   constructor(private transactionService: TransactionsService) {
      this.subscribeToTransactionResult();
   }

   public getNotifications() {
      return this.notificationSub.asObservable();
   }

   public subToToasts() {
      return this.toastSub.asObservable();
   }

   public addNotification(notification: Notification) {
      this.notificationSub.next([...this.notificationSub.getValue(), notification])
   }


   subscribeToTransactionResult() {
      this.transactionService.getTransactionResultSub().subscribe((result) => {
         if (result) {
            let notification: Notification = {
               type: NotificationType.TransactionUpdate,
               timestamp: new Date().getTime(),
               message: this.resultStatusToEnum(result.status),
            }

            this.addNotification(notification);
         }
      })
   }

   private resultStatusToEnum(status: any): TransactionStatusMessage {
      switch (status) {
         case status.InBlock:
            return TransactionStatusMessage.InBlock;
         case status.Finalized:
            return TransactionStatusMessage.Finalized;
         case status.Broadcast:
            return TransactionStatusMessage.Broadcast;
         case status.Ready:
            return TransactionStatusMessage.Ready;
         default:
            return TransactionStatusMessage.Future;
      }
   }
}

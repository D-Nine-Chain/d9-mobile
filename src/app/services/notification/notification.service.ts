import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import Swal from 'sweetalert2'
import { ISubmittableResult } from '@polkadot/types/types';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
const enum PopupTitles {
   Transaction = "Transaction Update",
   Error = "Error",
   Success = "Success",
   BurnStatus = "Burn Status"
}
// const resultMessages:Record<{

// }
@Injectable({
   providedIn: 'root'
})
export class NotificationService {

   constructor(private loadingController: LoadingController) { }
   loading: HTMLIonLoadingElement | null = null;
   async transactionNotification(result: ISubmittableResult) {
      if (!this.loading) {
         this.loading = await this.loadingController.create({
            message: 'Sending Transaction...',
         })
         this.loading.present();
      }
      this.loading.message = this.constructStatusMessage(result.status);
      if (result.status.isFinalized) {
         this.loading.dismiss();
         this.loading = null;
      }
      if (result.status.isReady) {
         this.loading?.dismiss();
         this.loading = null;
      }
      if (result.dispatchError) {
         console.log("dispatch error", result.dispatchError.toHuman())
         this.loading?.dismiss();
         this.loading = null;
      }

   }





   private constructStatusMessage(status: ExtrinsicStatus): string {
      switch (status.type) {
         case 'Future':
            return 'Transaction is in the future pool';
         case 'Ready':
            return 'Transaction is ready';
         case 'Broadcast':
            return `Transaction broadcasted`;
         case 'InBlock':
            return `Transaction is in block`;
         case 'Retracted':
            return `Transaction retracted`;
         case 'FinalityTimeout':
            return `Transaction finality timeout`;
         case 'Finalized':
            return `Transaction finalized.`;
         case 'Usurped':
            return `Transaction usurped`;
         case 'Dropped':
            return 'Transaction dropped';
         case 'Invalid':
            return 'Transaction invalid';
         default:
            return 'Unknown transaction status';
      }
   }
}

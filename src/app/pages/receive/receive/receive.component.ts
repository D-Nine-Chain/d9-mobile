import { Component, OnInit } from '@angular/core';
import { WalletService } from 'app/services/wallet/wallet.service';
import { Subscription } from 'rxjs';
import { Clipboard } from '@capacitor/clipboard';
@Component({
   selector: 'app-receive',
   templateUrl: './receive.component.html',
   styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {
   addressSub: Subscription | null = null;
   private longPressActive = false;
   constructor(private wallet: WalletService) {

   }
   address: string = '';
   ngOnInit() {
      this.addressSub = this.wallet.getActiveAddressObservable().subscribe((address: string) => {
         this.address = address
      })
   }
   onTouchStart(event: TouchEvent) {
      this.longPressActive = true;
      setTimeout(() => {
         if (this.longPressActive) {
            this.copyTextToClipboard();
         }
      }, 500); // Trigger after 1 second
   }

   onTouchEnd(event: TouchEvent) {
      this.longPressActive = false;
   }

   async copyTextToClipboard() {
      await Clipboard.write({
         string: this.address
      });
      console.log('Copied to clipboard');
      // Optionally, show some UI feedback here.
   }
}

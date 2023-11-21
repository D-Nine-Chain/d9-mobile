import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WalletService } from 'app/services/wallet/wallet.service';
import { Subscription } from 'rxjs';
import { Clipboard } from '@capacitor/clipboard';
import { D9QrCode } from 'app/types';
import { QrCodeDataType, QrCodeService } from 'app/services/qr-code/qr-code.service';
@Component({
   selector: 'app-receive',
   templateUrl: './receive.component.html',
   styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {
   @ViewChild('qrCodeContainer') qrCodeContainer!: ElementRef;
   addressSub: Subscription | null = null;
   private longPressActive = false;
   constructor(private wallet: WalletService, private qrcodeService: QrCodeService) {

   }
   ngAfterViewInit() {
      console.log("qr code container", this.qrCodeContainer)
      this.addressSub = this.wallet.getActiveAddressObservable().subscribe((address: string | null) => {
         if (address) {
            this.address = address
            const d9QrCode: D9QrCode = {
               type: 'Address',
               data: address,
               version: 1,
               metadata: {
                  timestamp: new Date().getTime(),
               }
            };
            this.qrcodeService.generateQRCodeToFile(d9QrCode)
               .then((canvas) => {
                  if (canvas) {
                     this.qrCodeContainer.nativeElement.innerHTML = '';
                     this.qrCodeContainer.nativeElement.appendChild(canvas);
                  }
               })
               .catch((err) => {
                  console.log("err is in creating QRcode caught in component ", err)
               })
         }
      })
   }

   address: string = '';
   ngOnInit() {

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

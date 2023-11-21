import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
   BarcodeScanner,
   BarcodeFormat,
   LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { QrCodeService } from 'app/services/qr-code/qr-code.service';

@Component({
   selector: 'app-qr-scanner',
   templateUrl: './qr-scanner.component.html',
   styleUrls: ['./qr-scanner.component.scss'],
})
export class QrScannerComponent implements OnInit {
   isSupported = false;
   barcodes: any[] = [];
   constructor(private qrCodeService: QrCodeService, private router: Router) {

   }
   barcode: any;
   async ngOnInit() {
      BarcodeScanner.isSupported().then(async (result) => {
         this.isSupported = result.supported;
         if (this.isSupported) {
            this.barcode = await this.scan();
         }
      });

   }

   async scan(): Promise<void> {
      return new Promise(async resolve => {
         document.querySelector('body')?.classList.add('barcode-scanner-active');

         const listener = await BarcodeScanner.addListener(
            'barcodeScanned',
            async result => {
               console.log("result is ", result.barcode.displayValue)
               const barcodeDataAsString = result.barcode.displayValue;
               if (this.qrCodeService.isValidCode(barcodeDataAsString)) {
                  console.log("valid code")
                  const data = JSON.parse(barcodeDataAsString);
                  await BarcodeScanner.stopScan();
                  await listener.remove();
                  document
                     .querySelector('body')
                     ?.classList.remove('barcode-scanner-active');


                  this.qrCodeService.processCode(barcodeDataAsString);
               }
               // resolve(result.barcode);
            },
         );

         await BarcodeScanner.startScan();
      });
   };

   async requestPermissions(): Promise<boolean> {
      const { camera } = await BarcodeScanner.requestPermissions();
      return camera === 'granted' || camera === 'limited';
   }

   async presentAlert(): Promise<void> {
      console.log("scanner alert")
      // await alert.present();
   }

}

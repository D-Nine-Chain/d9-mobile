import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MerchantMiningService } from 'app/services/contracts/merchant-mining/merchant-mining.service';
import { QrCodeService } from 'app/services/qr-code/qr-code.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { D9QrCode, MerchantQrCode } from 'app/types';
import { combineLatest, filter, firstValueFrom } from 'rxjs';

@Component({
   selector: 'app-merchant-qr',
   templateUrl: './merchant-qr.component.html',
   styleUrls: ['./merchant-qr.component.scss'],
})
export class MerchantQrComponent implements OnInit {
   @ViewChild('qrCodeContainer') qrCodeContainer!: ElementRef;
   subs: any[] = [];
   address: string = '';
   constructor(private modalControl: ModalController, private wallet: WalletService, private qrcode: QrCodeService, private merchant: MerchantMiningService) { }

   ngOnInit() { }
   async ngAfterViewInit() {
      combineLatest([this.wallet.getActiveAddressObservable(), this.merchant.merchantExpiryObservable()])
         .pipe(filter(
            ([address, expiry]) => {
               return address != null && expiry != null
            }
         ),
         )
         .subscribe(([address, expiry]) => {
            console.log("address is ", address, expiry)
            if (address == null || expiry == null) {
               // this.modalControl.dismiss();
               return;
            }
            const merchantQrCode: MerchantQrCode = {
               accountId: address,
               validUntil: expiry,
            }
            const d9QrCode: D9QrCode = {
               type: 'Merchant',
               data: merchantQrCode,
               version: 1,
               metadata: {
                  timestamp: new Date().getTime(),
               }
            }
            this.qrcode.generateQRCodeToFile(d9QrCode)
               .then((canvas) => {
                  if (canvas) {
                     this.qrCodeContainer.nativeElement.innerHTML = '';
                     this.qrCodeContainer.nativeElement.appendChild(canvas);
                  }
               })
               .catch((err) => {
                  console.log("err is in creating QRcode caught in component ", err)
               })
         })

   }

   closeModal() {
      this.modalControl.dismiss();
   }


}

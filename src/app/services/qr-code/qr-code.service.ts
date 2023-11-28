import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { decodeAddress } from '@polkadot/util-crypto';
import { D9QrCode, MerchantQrCode } from 'app/types';
import QRCode from 'qrcode';

export const QrCodeDataType = ['Address', 'Merchant']
@Injectable({
   providedIn: 'root'
})
export class QrCodeService {

   constructor(private router: Router) { }
   processCode(code: string): any {
      const data = JSON.parse(code);
      if (data.type === 'Address') {
         console.log("processing address")
         return this.processAddress(data.data);
      } else if (data.type === 'Merchant') {
         console.log("processing merchant")
         return this.processMerchantCode(data.data);
      }
      else {
         return null;
      }
   }

   async generateQRCodeToFile(d9QrCode: D9QrCode): Promise<any> {
      return new Promise((resolve, reject) => {
         // Serialize the data into a string format
         const dataString = JSON.stringify(d9QrCode);
         // const dataBuffer = Buffer.from(d9QrCode);
         QRCode.toCanvas(dataString, {
            errorCorrectionLevel: 'M'
         }, (err, canvas) => {
            console.log("err is in creating QRcode ", err)
            resolve(canvas)
            if (err) {
               reject(err)
            }
         })

      })
   }


   isValidCode(code: string): boolean {
      console.log("checking code validity")
      const data = JSON.parse(code);
      return this.validateD9QrCode(data);
   }

   getData(data: any) {

   }

   encodeMerchantQrCode(merchantCode: MerchantQrCode): string {
      let qrCode: D9QrCode = {
         type: 'Merchant',
         data: merchantCode,
         version: 1,
         metadata: {
            timestamp: new Date().getTime(),
         }
      };
      return this.encodeQrCodeString(qrCode);
   }

   encodeAddressQrCodeString(address: string): string {
      const qrCode: D9QrCode = {
         type: 'Address',
         data: address,
         version: 1,
         metadata: {
            timestamp: new Date().getTime(),
         }
      };
      return this.encodeQrCodeString(qrCode);
   }

   encodeQrCodeString(data: D9QrCode): string {
      return JSON.stringify(data);
   }

   validateD9QrCode(qrCode: D9QrCode): boolean {
      console.log("got this code ", qrCode)
      if (!(QrCodeDataType.includes(qrCode.type))) {
         console.error('Invalid type field');
         return false;
      }

      // Validate 'data' field
      if (typeof qrCode.data === 'string' && qrCode.type === 'Address') {
         console.log("checking address")
         return this.checkAddress(qrCode.data);
      } else if (typeof qrCode.data === 'object' && qrCode.data !== null) {
         switch (qrCode.type) {
            case 'Merchant':
               return this.isValidMerchantCode(qrCode.data);
            default:
               return false;
         }
      } else {
         // Data is neither a string nor a valid object
         console.error('Invalid data field: unknown type');
         return false;
      }
   }

   private processAddress(address: string): void {
      const param = {
         address: address
      }
      this.router.navigate(['/send'], { queryParams: param });
   }

   private processMerchantCode(merchantCode: MerchantQrCode): void {
      const param = {
         merchantAddress: merchantCode.accountId,
         validUntil: merchantCode.validUntil
      }
      console.log("params in process merchant code ", param)
      this.router.navigate(['/pay-merchant'], { queryParams: param });
   }

   isValidMerchantCode(data: any) {
      if (typeof data.accountId !== 'string' || data.accountId.trim() === '') {
         console.error('Invalid data field: accountId is not a string or is empty');
         return false;
      }
      if (!this.checkAddress(data.accountId)) {
         console.error('Invalid accountId');
         return false;
      }
      if (typeof data.validUntil !== 'number' || !Number.isInteger(data.validUntil) || data.validUntil <= 0) {
         console.error('Invalid data field: validUntil is not a positive integer');
         return false;
      }

      return true;
   }


   private checkAddress(address: string): boolean {
      // If data is a string, ensure it's not empty
      if (address.trim() === '') {
         console.error('Invalid data field: string is empty');
         return false;
      }
      if (address.length < 48) {
         console.error('Invalid data field: string is not 48 characters long');
         return false;
      }
      try {
         decodeAddress(address);
         return true;
      } catch (error) {
         return false;
      }
   }
}

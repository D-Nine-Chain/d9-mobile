import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { decodeAddress } from '@polkadot/util-crypto';
import { D9QrCode } from 'app/types';
import { resolve } from 'dns';
import QRCode from 'qrcode';

export const QrCodeDataType = ['Address']
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
         // If data is an object, validate its structure
         if (typeof qrCode.data.greenPoints !== 'number' || qrCode.data.greenPoints <= 0) {
            console.error('Invalid data field: invalid QRGreenPoints object');
            return false;
         }
      } else {
         // Data is neither a string nor a valid object
         console.error('Invalid data field: unknown type');
         return false;
      }

      // Validate 'version' field (assuming version should be a positive number)
      if (typeof qrCode.version !== 'number' || qrCode.version <= 0) {
         console.error('Invalid version field');
         return false;
      }

      // Validate 'metadata' field (more complex validation can be added based on the expected structure)
      // As an example, checking if metadata is an object
      if (typeof qrCode.metadata !== 'object' || qrCode.metadata === null) {
         console.error('Invalid metadata field');
         return false;
      }

      return true;
   }

   private processAddress(address: string): string {
      return "";
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

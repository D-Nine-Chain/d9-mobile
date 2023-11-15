import { AbstractControl, ValidatorFn } from "@angular/forms";
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

export function substrateAddressValidator(): ValidatorFn {
   return (control: AbstractControl): { [key: string]: any } | null => {
      const isValidSubstrateAddress = isValidPolkadotAddress(control);
      return isValidSubstrateAddress ? null : { 'invalidSubstrateAddress': { value: control.value } };
   };
}

function isValidPolkadotAddress(control: AbstractControl) {
   try {
      const address = control.value;
      // Decode the address, this will throw an error if the address is invalid
      decodeAddress(address);
      // const reEncodedAddress = encodeAddress(decodeAddress(address), 42);
      // return reEncodedAddress === address;

      return true;
   } catch (error) {
      return false;
   }
}


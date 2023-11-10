import { Injectable } from '@angular/core';
import { mnemonicGenerate, mnemonicToMiniSecret, mnemonicValidate, ed25519PairFromSeed, encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex, hexToU8a } from '@polkadot/util';
import { Keypair } from '@polkadot/util-crypto/types';
import { DataType, SecureStorage } from '@aparajita/capacitor-secure-storage';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'environments/environment';
import { SubmittableExtrinsic } from '@polkadot/api/types/submittable';
import { ISubmittableResult } from '@polkadot/types/types';
import { BehaviorSubject } from 'rxjs';
const { Keyring } = require('@polkadot/api');
@Injectable({
   providedIn: 'root'
})
export class WalletService {
   //todo add hard/soft derivatives
   private publicKey: Uint8Array | null = null;
   publicKeyObservable = new BehaviorSubject<string>("");
   addressObservable = new BehaviorSubject<string>("");
   constructor() {
      this.loadPublicKey();
   }
   public getPublicKey(): string {
      if (this.publicKey != null) {
         return u8aToHex(this.publicKey);
      }
      return "";
   }

   public getAddress(): string {
      console.log("public key is ", this.publicKey)
      return this.publicKey ? encodeAddress(this.publicKey) : "";
   }

   public createNewMnemonic(): string {
      let validMnemonic = false;
      let mnemonic = "";
      while (validMnemonic === false) {
         mnemonic = mnemonicGenerate();
         validMnemonic = mnemonicValidate(mnemonic);
      }
      return mnemonic;
   }

   public createNewWallet(mnemonic: string): Promise<void> {
      const seed = mnemonicToMiniSecret(mnemonic);
      const keyPair: Keypair = ed25519PairFromSeed(seed);
      this.publicKey = keyPair.publicKey;
      console.info("wallet created")
      return this.saveWallet(keyPair);
   }

   public async loadPublicKey(): Promise<void> {
      const result = await Preferences.get({ key: environment.preferences_publickey_key });
      if (result.value) {
         console.log("public key found", result.value);
         this.addressObservable.next(encodeAddress(result.value));
         this.publicKey = hexToU8a(result.value);
      }
      else {
         console.log("no public key found");
         console.log("this function may create a wallet in the future")
      }
   }

   public saveWallet(keyPair: Keypair): Promise<void> {
      let privateKeyHex = u8aToHex(keyPair.secretKey);
      console.info("wallet saved")
      Preferences.set({ key: environment.preferences_publickey_key, value: u8aToHex(keyPair.publicKey) });
      return SecureStorage.set(environment.secure_storage_privatekey_key, privateKeyHex)
   }

   public signContractTransaction(transaction: SubmittableExtrinsic<"promise", ISubmittableResult>): Promise<any> {
      return new Promise(async (resolve, reject) => {
         try {
            const keyPair = await this.getKeyPair();
            const signedTransaction = await transaction.signAsync(keyPair);
            resolve(signedTransaction);
         } catch (error) {
            reject(error);
         }
      });
   }

   private async getKeyPair(): Promise<any> {
      const privateKeyHex: DataType | null = await SecureStorage.get(environment.secure_storage_privatekey_key);
      if (!privateKeyHex) {
         throw new Error("No private key found");
      }
      const keyring = new Keyring({ type: 'ed25519' });
      const privateKeyBuf = Buffer.from(privateKeyHex as string, 'hex');
      const keyPair = keyring.addFromSeed(privateKeyBuf);
      return keyPair;
   }
}

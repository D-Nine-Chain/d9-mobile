import { Injectable } from '@angular/core';
import { mnemonicGenerate, mnemonicToMiniSecret, mnemonicValidate, ed25519PairFromSeed } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { Keypair } from '@polkadot/util-crypto/types';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';
@Injectable({
   providedIn: 'root'
})
export class WalletService {
   private keyPair: Keypair | null = null;
   constructor() { }
   public getPublicKey(): string {
      if (this.keyPair != null) {
         return u8aToHex(this.keyPair.publicKey);
      }
      return "";
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
      this.keyPair = keyPair;
      console.info("wallet created")
      return this.saveWallet();
   }

   public saveWallet(): Promise<void> {
      if (this.keyPair != null) {
         let privateKeyHex = u8aToHex(this.keyPair.secretKey);
         console.info("wallet saved")
         return SecureStorage.set("d9_privateKey", privateKeyHex)
      }
      return Promise.reject("No keypair to save")
   }
}

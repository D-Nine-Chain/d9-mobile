import { Injectable } from '@angular/core';
import { mnemonicGenerate, mnemonicToMiniSecret, mnemonicValidate, ed25519PairFromSeed, cryptoWaitReady } from '@polkadot/util-crypto';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'environments/environment';
import { SubmittableExtrinsic } from '@polkadot/api/types/submittable';
import { ISubmittableResult } from '@polkadot/types/types';
import { BehaviorSubject, Observable } from 'rxjs';
import { Keyring } from '@polkadot/api';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';

@Injectable({
   providedIn: 'root'
})
export class WalletService {
   //todo add hard/soft derivatives
   private keyRing: Keyring | null = null;
   private activeAddress: string = "";
   private allAddresses: string[] = [];
   private publicKey: Uint8Array | null = null;
   private hardDerivationCounter = 0;
   publicKeyObservable = new BehaviorSubject<string>("");
   activeAddressSubject = new BehaviorSubject<string>("");
   allAddressesSubject = new BehaviorSubject<string[]>([]);
   constructor() {
      cryptoWaitReady()
         .then(() => {
            console.log("crypto wait ready done")
            this.loadAddresses()
               .then(() => {
               })
               .catch((error) => {
                  this.createNewWallet(this.createNewMnemonic())
               })
         })

   }

   public async loadAddresses(): Promise<void> {
      let allAddresses = [];
      console.log("loading addresses");
      const allAddressesResult = await Preferences.get({ key: environment.preferences_addresses });
      const defaultAddressResult = await Preferences.get({ key: environment.preferences_default_address_key });
      console.log("default address result", defaultAddressResult)
      if (allAddressesResult.value) {
         console.log("all addresses, ", allAddressesResult.value)
         allAddresses = JSON.parse(allAddressesResult.value);
         this.updateAddreressesList(allAddresses)
      }
      if (defaultAddressResult.value) {
         console.log("default address, ", defaultAddressResult.value);
         this.activeAddressSubject.next(defaultAddressResult.value);
      }
      if (!defaultAddressResult.value && allAddresses.length > 0) {
         this.activeAddressSubject.next(allAddresses[0]);
      }
      if (allAddresses.length == 0 && !defaultAddressResult.value) {
         throw new Error("No addresses to load")
      }
   }

   public async loadKeyring(): Promise<void> {

      this.keyRing = new Keyring({ type: 'sr25519' });
      const keypairAggregate = await SecureStorage.get(environment.secure_storage_keypair_aggregate);
      if (!keypairAggregate) {
         throw new Error("No keyring found");
      }
      const keyPairs = JSON.parse(keypairAggregate as string);
      keyPairs.forEach((keyPair: KeyringPair$Json) => {
         this.keyRing!.addFromJson(keyPair);
      })


   }

   public getActiveAddressObservable(): Observable<string> {
      return this.activeAddressSubject.asObservable();
   }

   public updateAddressesList(newAddresses: string[]): void {
      const currentAddresses = this.allAddressesSubject.getValue();
      const updatedAddresses = [...currentAddresses, ...newAddresses];
      this.allAddressesSubject.next(updatedAddresses);
   }


   public updateAddreressesList(address: string[]): void {
      this.allAddressesSubject.next([...address]);
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

   public async createNewWallet(mnemonic: string): Promise<void> {
      // const seed = mnemonicToMiniSecret(mnemonic);
      // const keyPair: Keypair = ed25519PairFromSeed(seed);
      // this.publicKey = keyPair.publicKey;
      // console.info("wallet created")
      await cryptoWaitReady();
      const keyring = new Keyring({ type: 'sr25519' })
      const alice = keyring.addFromUri('//Alice', { name: 'Alice default' })
      return this.saveWallet(keyring);
   }

   public async saveWallet(keyring: Keyring): Promise<void> {
      console.log("saving wallet")
      const keyPairs: KeyringPair[] = keyring.getPairs();
      const keyPairAddresses = keyPairs.map((keyPair) => { return keyPair.address })
      const keyPairJsonArr = keyPairs.map((keyPair) => {
         keyPair.lock();
         return keyPair.toJson();
      });
      const keyPairsJsonString = JSON.stringify(keyPairJsonArr);

      console.info("wallet saved")
      await Preferences.set({ key: environment.preferences_addresses, value: JSON.stringify(keyPairAddresses) });
      await Preferences.set({ key: environment.preferences_d9_hard_derivation_counter_key, value: this.hardDerivationCounter.toString() });
      return SecureStorage.set(environment.secure_storage_keypair_aggregate, keyPairsJsonString)
   }

   public deriveAccountFromExisting() {

   }

   public signContractTransaction(address: string, transaction: SubmittableExtrinsic<"promise", ISubmittableResult>): Promise<any> {
      return new Promise(async (resolve, reject) => {
         try {
            const keyPair = await this.getKeyPair(address);
            const signedTransaction = await transaction.signAsync(keyPair);
            resolve(signedTransaction);
         } catch (error) {
            reject(error);
         }
      });
   }

   //todo this function will change
   // todo will add password
   private async getKeyPair(address: string): Promise<KeyringPair> {
      // const keyPairsArrayString: DataType | null = await SecureStorage.get(environment.secure_storage_keypair_aggregate);
      // const keyPairsArray = JSON.parse(keyPairsArrayString as string);
      // const keyRing = new Keyring({ type: 'sr25519' });
      // const keyRingInstance = keyRing.createFromJson(keyPairsArray);
      // return keyRingInstance.ke;

      let keypair = this.keyRing?.getPair(address);
      if (!keypair) {
         throw new Error("keypair not found");
      } else {
         return keypair
      }
   }
}

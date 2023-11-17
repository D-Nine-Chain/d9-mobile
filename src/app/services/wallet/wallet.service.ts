import { Injectable } from '@angular/core';
import { mnemonicGenerate, mnemonicValidate, cryptoWaitReady } from '@polkadot/util-crypto';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'environments/environment';
import { SubmittableExtrinsic } from '@polkadot/api/types/submittable';
import { BehaviorSubject, Observable, firstValueFrom, from, switchMap } from 'rxjs';
import { Keyring } from '@polkadot/api';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';

@Injectable({
   providedIn: 'root'
})
export class WalletService {
   //todo add hard/soft derivatives
   private keyRing: Keyring | null = null;
   private hardDerivationCounter = 0;
   private activeAddressSubject = new BehaviorSubject<string>("");
   private allAddressesSubject = new BehaviorSubject<string[]>([]);
   constructor() {
      cryptoWaitReady()
         .then(() => {
            console.log("crypto wait ready done")
            this.loadAddresses()
               .then(() => {
                  return this.loadKeyring()
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
      if (allAddressesResult.value) {

         allAddresses = JSON.parse(allAddressesResult.value);
      }
      if (defaultAddressResult.value) {
         console.log("default address, ", defaultAddressResult.value);
         this.activeAddressSubject.next(defaultAddressResult.value);
      }
      if (!defaultAddressResult.value && allAddresses.length > 0) {
         console.log("actived address set from all addresses array", allAddresses[0])
         this.activeAddressSubject.next(allAddresses[0]);
      }
      if (allAddresses.length == 0 && !defaultAddressResult.value) {
         throw new Error("No addresses to load")
      }
   }

   public async loadKeyring(): Promise<void> {

      this.keyRing = new Keyring({ type: 'sr25519' });
      this.keyRing.setSS58Format(42);
      const keypairAggregate = await SecureStorage.get(environment.secure_storage_keypair_aggregate);
      if (!keypairAggregate) {
         console.log("cant find keypairs ")
         throw new Error("No keyring found");
      } else {
      }
      const keyPairs = JSON.parse(keypairAggregate as string);
      keyPairs.forEach((keyPair: KeyringPair$Json) => {
         console.log("loaded keypair ", keyPair)
         this.keyRing!.addFromJson(keyPair);
      })
      console.log("keyring loaded")
   }

   public getActiveAddressObservable(): Observable<string> {
      return this.activeAddressSubject.asObservable();
   }

   public updateActiveAddress(newAddress: string): void {
      this.activeAddressSubject.next(newAddress);
   }

   public updateAddressesList(newAddresses: string[]): void {
      const currentAddresses = this.allAddressesSubject.getValue();
      const updatedAddresses = [...currentAddresses, ...newAddresses];
      this.allAddressesSubject.next(updatedAddresses);
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
      const keyring = new Keyring({ type: 'sr25519' })
      // const alice = keyring.addFromUri('//Alice', { name: 'Alice default' })
      keyring.addFromUri(mnemonic)
      return this.saveWallet(keyring);
   }

   public async saveWallet(keyring: Keyring): Promise<void> {

      console.log("saving wallet")
      const keyPairs: KeyringPair[] = keyring.getPairs();
      const keyPairAddresses = keyPairs.map((keyPair) => { return keyPair.address })
      const keyPairJsonArr = keyPairs.map((keyPair) => {
         // keyPair.lock();
         //todo figure out how to reengage lock
         return keyPair.toJson();
      });
      const keyPairsJsonString = JSON.stringify(keyPairJsonArr);
      console.log("key pair json ", keyPairsJsonString)
      console.info("wallet saved")
      await Preferences.set({ key: environment.preferences_addresses, value: JSON.stringify(keyPairAddresses) });
      await Preferences.set({ key: environment.preferences_d9_hard_derivation_counter_key, value: this.hardDerivationCounter.toString() });

      this.updateAddressesList(keyPairAddresses);
      this.updateActiveAddress(keyPairAddresses[0]);
      return await SecureStorage.set(environment.secure_storage_keypair_aggregate, keyPairsJsonString)

   }

   public async resetEverything() {
      await Preferences.clear();
      await SecureStorage.clear();
      console.log("reset everything")
   }

   public deriveAccountFromExisting() {

   }

   public async signContractTransaction(transaction: SubmittableExtrinsic<'rxjs'>): Promise<SubmittableExtrinsic<'rxjs'>> {
      console.log("signing transaction")
      return firstValueFrom(
         this.getActiveAddressObservable().pipe(
            switchMap(address => from(this.getKeyPair(address))
               .pipe(switchMap((keyPair) => {
                  if (keyPair.isLocked) {
                     keyPair.unlock();
                     console.log(keyPair.address, ' is unlocked');
                  }
                  return transaction.signAsync(keyPair, { nonce: -1 })
               })))
         )

      );
   }

   //todo this function will change
   // todo will add password
   private async getKeyPair(address: string): Promise<KeyringPair> {
      console.log("getting keypair for address ", address)
      let keypair = this.keyRing?.getPair(address);
      console.log("this keypair found ", keypair)
      if (!keypair) {
         throw new Error("keypair not found");
      } else {
         keypair.unlock
         console.log("keypair found", keypair)
         // keypair.unlock();
         // console.log("keypair is ", keypair)
         return keypair
      }
   }
}

import { Injectable } from '@angular/core';
import { mnemonicGenerate, mnemonicValidate, cryptoWaitReady } from '@polkadot/util-crypto';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'environments/environment';
import { SubmittableExtrinsic } from '@polkadot/api/types/submittable';
import { BehaviorSubject, Observable, filter, first, firstValueFrom, from, switchMap } from 'rxjs';
import { Keyring } from '@polkadot/api';
import { KeyringPair, KeyringPair$Json, KeyringPair$Meta } from '@polkadot/keyring/types';

@Injectable({
   providedIn: 'root'
})
export class WalletService {
   //todo add hard/soft derivatives
   private keyRing: Keyring | null = null;
   private softDerivationCounter: number | null = 0;
   private rootAddress: string | null = null;
   private activeAddressSubject = new BehaviorSubject<string | null>(null);
   private allAddressesSubject: BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(new Set());
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
   public async loadSoftDerivationCounter(): Promise<void> {
      const softDerivationCounterResult = await Preferences.get({ key: environment.preferences_d9_soft_derivation_counter });
      if (softDerivationCounterResult.value) {
         this.softDerivationCounter = parseInt(softDerivationCounterResult.value);
      } else {
         this.softDerivationCounter = 0;
      }
   }

   public async loadAddresses(): Promise<void> {
      let allAddresses = [];
      const softDerivationCounterResult = await Preferences.get({ key: environment.preferences_d9_soft_derivation_counter });
      if (softDerivationCounterResult.value) {
         this.softDerivationCounter = parseInt(softDerivationCounterResult.value);
      } else {
         this.softDerivationCounter = 0;
      }
      const allAddressesResult = await Preferences.get({ key: environment.preferences_addresses });
      const defaultAddressResult = await Preferences.get({ key: environment.preferences_default_address });
      const rootAddressResult = await Preferences.get({ key: environment.preferences_root_address });
      if (allAddressesResult.value) {
         allAddresses = JSON.parse(allAddressesResult.value);
         this.updateAddressesList(allAddresses);
      }
      if (defaultAddressResult.value) {
         console.log("default address, ", defaultAddressResult.value);
         this.activeAddressSubject.next(defaultAddressResult.value);
      }
      if (!defaultAddressResult.value && allAddresses.length > 0) {
         this.activeAddressSubject.next(allAddresses[0]);
         this.rootAddress = allAddresses[0];
      }
      if (allAddresses.length == 0 && !defaultAddressResult.value) {
         throw new Error("No addresses to load")
      }
      if (rootAddressResult.value) {
         this.rootAddress = rootAddressResult.value;
      }
      if (!rootAddressResult.value && allAddresses.length > 0) {
         this.rootAddress = allAddresses[0];
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
         this.keyRing!.addFromJson(keyPair);
      })
      console.log("keyring loaded")
   }
   public getAddressPromise(): Promise<string | null> {
      return firstValueFrom(this.activeAddressObservable().pipe(
         filter(address => address !== null),
         first()
      ))
   }
   public activeAddressObservable(): Observable<string | null> {
      return this.activeAddressSubject.asObservable().pipe(
         filter(address => address != null),
      );
   }

   public getAllAddressesObservable(): Observable<Set<string>> {
      return this.allAddressesSubject.asObservable();
   }

   public updateActiveAddress(newAddress: string): void {
      this.activeAddressSubject.next(newAddress);
   }

   public updateAddressesList(newAddresses: string[]): void {
      const currentAddresses = this.allAddressesSubject.getValue();
      newAddresses.forEach((address) => {
         if (!currentAddresses.has(address)) {
            currentAddresses.add(address)
         }
      })
      this.allAddressesSubject.next(currentAddresses);
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
      const activeAddress = this.activeAddressSubject.getValue();
      if (!activeAddress) {
         this.updateActiveAddress(keyPairs[0].address);
      }
      const keyPairAddresses = keyPairs.map((keyPair) => { return keyPair.address })
      const keyPairJsonArr = keyPairs.map((keyPair) => {
         // keyPair.lock();
         //todo figure out how to reengage lock
         return keyPair.toJson();
      });
      const keyPairsJsonString = JSON.stringify(keyPairJsonArr);
      console.log("key pair json ", keyPairsJsonString)
      console.info("wallet saved")
      if (this.softDerivationCounter == null) {
         await this.loadSoftDerivationCounter();
      }
      try {
         await Preferences.set({ key: environment.preferences_addresses, value: JSON.stringify(keyPairAddresses) });
         await Preferences.set({ key: environment.preferences_d9_soft_derivation_counter, value: this.softDerivationCounter!.toString() });
      } catch (err) {
         console.log(err)
      }
      this.updateAddressesList(keyPairAddresses);
      if (this.activeAddressSubject.getValue() == "") {
         this.updateActiveAddress(keyPairAddresses[0]);
      }
      return await SecureStorage.set(environment.secure_storage_keypair_aggregate, keyPairsJsonString)

   }

   public async resetEverything() {
      await Preferences.clear();
      await SecureStorage.clear();
      console.log("reset everything")
   }

   public async deriveNewKey(name: string): Promise<string> {
      if (this.softDerivationCounter == null) {
         try {
            await this.loadSoftDerivationCounter();
         } catch (error) {
            console.log(error)
         }
      }
      this.softDerivationCounter!++;
      console.log("soft derivation counter ", this.softDerivationCounter)
      const keyringPairMeta = {
         name: name,
         suri: `/${this.softDerivationCounter}}`
      }
      console.log("deriving new key")
      let keyring = await this.getKeyring();
      if (!this.rootAddress) {
         await this.loadAddresses();
      }
      try {
         const keyPair = keyring.getPair(this.rootAddress!);
         if (keyPair.isLocked) {
            keyPair.unlock();
            console.log(keyPair.address, ' is unlocked');
         }
         const derived = keyPair.derive(`/${this.softDerivationCounter}`, keyringPairMeta);
         keyring.addPair(derived);
         this.updateAddressesList([derived.address]);
         console.log("derived keypair ", derived)
         await this.saveWallet(keyring);
         return derived.address
      } catch (err) {
         console.log(err)
         throw new Error("error deriving new key")
      }
   }
   public async getKeyMetadata(address: string): Promise<KeyringPair$Meta> {
      let keyring = await this.getKeyring();
      try {
         console.log("getting key pair for address ", address)
         const keyPair = keyring.getPair(address);

         return keyPair.meta
      } catch (err) {
         console.log("getting keypair error", err)
         throw err;
      }
   }
   public async signTransaction(transaction: SubmittableExtrinsic<'rxjs'>): Promise<SubmittableExtrinsic<'rxjs'>> {
      console.log("signing transaction")
      return firstValueFrom(
         this.activeAddressObservable().pipe(
            filter(address => address != null),
            switchMap(address => from(this.getKeyPair(address!))
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
   private async getKeyring(): Promise<Keyring> {
      if (!this.keyRing) {
         await this.loadKeyring();
      }
      return this.keyRing!;
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

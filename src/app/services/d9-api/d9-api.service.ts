import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BN, BN_ONE } from "@polkadot/util";
import type { WeightV2 } from '@polkadot/types/interfaces'
import { ApiPromise, WsProvider } from '@polkadot/api';
import { customRpc } from './customRPC';
import { ContractUtils } from 'app/contracts/contract-utils/contract-utils';
import { ContractPromise } from 'app/utils/api-contract';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { toPromiseMethod } from '@polkadot/api';
import { burnContractABI } from 'app/contracts/burn-manager/burnManagerABI';
import { GasLimits } from 'app/types';
import { BurnManager } from 'app/contracts/burn-manager/burn-manager';
export const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
export const PROOFSIZE = new BN(119903836479112);
export const STORAGE_DEPOSIT_LIMIT = null;

@Injectable({
   providedIn: 'root'
})
export class D9ApiService {
   d9: ApiPromise | null = null;
   wsProvider = new WsProvider(environment.ws_endpoint);


   constructor() {
      this.prepAPI()
         .catch((err) => {
            console.log("error in getting api")
            console.error(err);
         })
   }
   async getContract(contractName: string): Promise<any> {
      if (!this.d9) {
         await this.prepAPI();
      }
      const contractMetadata = await ContractUtils.getContractMetadata(contractName);
      console.log("contract metadata is ", contractMetadata)
      const contract = new ContractPromise(this.d9!, contractMetadata.abi, contractMetadata.address);
      const gasLimits: GasLimits = {
         readLimit: await this.getReadGasLimit(),
         writeLimit: await this.getGasLimit()
      }

      switch (contractName) {
         case environment.contracts.burn_manager.name:
            return new BurnManager(contract, gasLimits);
         default:
            throw new Error("Contract not found");
      }
   }

   public async getAPI(): Promise<ApiPromise> {
      await this.prepAPI();
      if (this.d9) {
         return this.d9;
      } else {
         throw new Error("API not initialized")
      }
   }
   public async getGasLimit() {
      let api = await this.getAPI();
      return api.registry.createType('WeightV2', { refTime: new BN(50_000_000_000), proofSize: new BN(800_000) }) as WeightV2;
   }

   public async getReadGasLimit() {
      return this.d9?.registry.createType('WeightV2', { refTime: MAX_CALL_WEIGHT, proofSize: PROOFSIZE }) as WeightV2
   }

   private async prepAPI() {
      if (!this.d9) {
         try {
            this.d9 = await ApiPromise.create({
               provider: this.wsProvider,
               rpc: customRpc
            });
         } catch (err) {
            console.log("error in prep api ", err)
         }
         return;
      }
      else {
         return;
      }
   }

   // private async prepareMessageToContract(contractAddress: string, value: number, data: any) {
   //    const gasLimit = await this.getGasLimit();
   //    const storageLimit = environment.storage_deposit_limit;
   //    const reformattedValue = Utils.toBigNumberString(value, CurrencyTickerEnum.D9);
   //    const tx = this.d9api?.tx.contracts.call(contractAddress, reformattedValue, gasLimit, storageLimit, data);

   //    // Sign and send the transaction
   //    // const result = await tx.signAndSend(sender, { ...options });

   //    return tx;
   // }


}

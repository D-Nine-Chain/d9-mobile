import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BN, BN_ONE } from "@polkadot/util";
import type { WeightV2 } from '@polkadot/types/interfaces'
import { ApiPromise, WsProvider } from '@polkadot/api';
import { customRpc } from './customRPC';
export const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
export const PROOFSIZE = new BN(119903836479112);
export const STORAGE_DEPOSIT_LIMIT = null;

@Injectable({
   providedIn: 'root'
})
export class D9ApiService {
   chainAPI: ApiPromise | null = null;
   wsProvider = new WsProvider(environment.ws_endpoint);


   constructor() {
      this.prepAPI()
         .catch((err) => {
            console.error(err);
         })
   }
   // async getContract(contractInfo: { address: string, file_name: string }): Promise<ContractPromise> {

   //    const abiJSON = await ContractUtils.getABIJSON(contractInfo);
   //    const abi = new Abi(abiJSON, this.chainAPI?.registry.getChainProperties())
   //    const contract = new ContractPromise(this.chainAPI!, abi, contractInfo.address);//todo fix the ! issue
   //    return contract;

   // }
   public async getAPI(): Promise<ApiPromise> {
      await this.prepAPI();
      if (this.chainAPI) {
         return this.chainAPI;
      } else {
         throw new Error("API not initialized")
      }
   }
   public async getGasLimit() {
      let api = await this.getAPI();
      return api.registry.createType('WeightV2', { refTime: new BN(50_000_000_000), proofSize: new BN(800_000) }) as WeightV2;
   }

   public async getReadGasLimit() {
      return this.chainAPI?.registry.createType('WeightV2', { refTime: MAX_CALL_WEIGHT, proofSize: PROOFSIZE }) as WeightV2
   }

   private async prepAPI() {
      if (!this.chainAPI) {
         this.chainAPI = await ApiPromise.create({
            provider: this.wsProvider,
            rpc: customRpc
         });
      }
   }
}

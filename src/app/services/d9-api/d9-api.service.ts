import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BN, BN_ONE } from "@polkadot/util";

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
   wsProvider = new WsProvider(environment.ws_endpoint,);


   constructor() {
      this.prepAPI()
         .catch((err) => {
            console.error(err);
         })
   }

   public async getAPI(): Promise<ApiPromise> {
      await this.prepAPI();
      if (this.chainAPI) {
         return this.chainAPI;
      } else {
         throw new Error("API not initialized")
      }
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

import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BN, BN_ONE } from "@polkadot/util";
import type { WeightV2 } from '@polkadot/types/interfaces'
import type { PalletMetadataLatest } from '@polkadot/types/interfaces/metadata'
import { WsProvider, ApiRx } from '@polkadot/api';
import { customRpc } from './customRPC';
import { ContractUtils } from 'app/contracts/contract-utils/contract-utils';
import { ContractRx } from 'app/utils/api-contract';
import { GasLimits } from 'app/types';
import { BurnManager } from 'app/contracts/burn-manager/burn-manager';
import { Observable, filter, first, firstValueFrom, from } from 'rxjs';
import { MerchantManager } from 'app/contracts/merchant-manager/merchant-manager';
import { AmmManager } from 'app/contracts/amm-manager/amm-manager';
import { UsdtManager } from 'app/contracts/usdt-manager/usdt-manager';
import { BurnMiner } from 'app/contracts/burn-miner/burn-miner';
export const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
export const PROOFSIZE = new BN(119903836479112);
export const STORAGE_DEPOSIT_LIMIT = null;

@Injectable({
   providedIn: 'root'
})
export class D9ApiService {
   d9: Observable<ApiRx>;
   wsProvider = new WsProvider(environment.ws_endpoint);
   contractsModuleMetadata: PalletMetadataLatest | null = null;

   constructor() {

      this.d9 = ApiRx.create({
         provider: this.wsProvider,
         rpc: customRpc
      })
      this.getMetadata()
         .then((metadata) => {
            this.contractsModuleMetadata = metadata.asLatest.pallets[13];
         })
      this.getContractInfo().then((contractInfo) => { })
   }
   async getContractInfo() {
      console.log("getting contract info")
      const api = await this.getApiPromise();

      api.query.balances.totalIssuance()
         .subscribe((issuance) => {
            console.log("issuance", issuance.toHuman())
         })
      const contractInfo = (await firstValueFrom(api.query.contracts.contractInfoOf(environment.contracts.main_pool.address))).toJSON();
      console.log("contract info", contractInfo)
   }
   getError(index: string) {
      if (this.contractsModuleMetadata) {
         return this.contractsModuleMetadata.errors;
      }
      return null;
   }
   async getMetadata() {
      const d9 = await this.getApiPromise();
      return firstValueFrom(d9.rpc.state.getMetadata());
   }

   getApiPromise() {
      return firstValueFrom(this.d9.pipe(
         filter(api => api !== null && api !== undefined),
         first()
      ))
   }

   getApiObservable() {
      return this.d9
   }

   async getContract(contractName: string): Promise<any> {
      const d9 = await this.getApiPromise();
      const contractMetadata = await ContractUtils.getContractMetadata(contractName);
      const contract = new ContractRx(d9, contractMetadata.abi, contractMetadata.address);
      const gasLimits: GasLimits = {
         readLimit: await this.getReadGasLimit(),
         writeLimit: await this.getGasLimit()
      }

      switch (contractName) {
         case environment.contracts.main_pool.name:
            return new BurnManager(contract, gasLimits);
         case environment.contracts.merchant.name:
            return new MerchantManager(contract, gasLimits);
         case environment.contracts.amm.name:
            return new AmmManager(contract, gasLimits);
         case environment.contracts.usdt.name:
            return new UsdtManager(contract, gasLimits);
         case environment.contracts.burn_miner.name:
            return new BurnMiner(contract, gasLimits);
         default:
            throw new Error("Contract not found");
      }
   }

   public async getGasLimit() {
      let api = await this.getApiPromise();
      return api.registry.createType('WeightV2', { refTime: new BN(50_000_000_000), proofSize: new BN(800_000) }) as WeightV2;
   }

   public async getReadGasLimit() {
      let api = await this.getApiPromise();
      return api.registry.createType('WeightV2', { refTime: MAX_CALL_WEIGHT, proofSize: PROOFSIZE }) as WeightV2
   }

}

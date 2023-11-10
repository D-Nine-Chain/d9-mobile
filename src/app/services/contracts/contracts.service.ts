import { Injectable } from '@angular/core';
import { Abi, ContractPromise } from '@polkadot/api-contract';
import { ContractUtils } from 'app/contracts/contract-utils/contract-utils';
import { D9ApiService } from '../d9-api/d9-api.service';
@Injectable({
   providedIn: 'root'
})
export class ContractsService {

   constructor(private d9: D9ApiService) {

   }

   async getContract(contractInfo: { address: string, file_name: string }): Promise<ContractPromise> {
      const chainAPI = await this.d9.getAPI();
      const abiJSON = await ContractUtils.getABIJSON(contractInfo);
      const abi = new Abi(abiJSON, chainAPI?.registry.getChainProperties())
      const contract = new ContractPromise(chainAPI, abi, contractInfo.address);
      return contract;

   }
}

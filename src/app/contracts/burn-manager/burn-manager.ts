import { CurrencyTickerEnum, Utils } from "app/utils/utils";
import { environment } from "environments/environment";
import { BN } from '@polkadot/util';
import { BurnPortfolio, GasLimits } from "app/types";
import { AppError } from "app/utils/app-error/app-error";
import { ContractPromise } from "app/utils/api-contract";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { Observable, firstValueFrom, map } from "rxjs";
import { ContractRx } from "@polkadot/api-contract";
import { ContractCallOutcome } from "app/utils/api-contract/types";
export class BurnManager {
   contract: ContractRx;
   gasLimits: GasLimits;
   constructor(contract: any, gasLimits: GasLimits) {
      this.contract = contract;
      this.gasLimits = gasLimits;
   }

   Errors = {
      GettingTotalNetworkBurned: "BurnManager::ErrorGettingTotalNetworkBurned",
      GettingBurnPortfolio: "BurnManager::ErrorGettingBurnPortfolio",

   }

   makeBurnTx(amount: number) {

      return this.contract.tx['burn']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
         value: Utils.toBigNumberString(amount, CurrencyTickerEnum.D9)
      }, environment.contracts.burn.address)
   }


   makeWithdrawTx(): SubmittableExtrinsic<'rxjs'> {
      // const contract = await this.contractsService.getContract(environment.contracts.burn_manager);
      return this.contract.tx['withdraw']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, environment.contracts.burn.address)
   }

   getBurnPortfolio(address: string): Promise<ContractCallOutcome> {
      console.log("getBurnPortfolio called")
      return firstValueFrom(this.contract.query['getPortfolio'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit
      }, address))
   }

   getNetworkBurned(address: string): Promise<ContractCallOutcome> {
      console.log("total burned called")
      return firstValueFrom(this.contract.query['getTotalBurned'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit
      }))
   }
   /**
    * @description total burned by whole network
    */
   // async getTotalNetworkBurned(address: string): Promise<string> {
   //    console.log("total burned called")
   //    // const contract = await this.contractsService.getContract(environment.contracts.burn_manager);
   //    const { output, result } = await this.contract.query['getTotalBurned'](address, {
   //       gasLimit: this.gasLimits.readLimit,
   //       storageDepositLimit: environment.storage_deposit_limit
   //    });
   //    console.log("output is ", output)
   //    console.log("result is ", result.toJSON())
   //    if (output) {
   //       console.log("total burned", (output!.toJSON()! as any).ok)
   //       const totalBurned = (output!.toJSON()! as any).ok
   //       //polkadot api may return string or number depending 
   //       //on the size of the number. small numbers are returned as numbers
   //       // large are returned as hex strings
   //       return typeof totalBurned === 'string' ? totalBurned : totalBurned.toString();
   //    }
   //    else {
   //       throw Error(this.Errors.GettingTotalNetworkBurned);
   //    }

   // }
   /**
    * @description the network daily return is determined by the total amount burned by the network.
    * @returns percentage of return
    */
   // async getReturnPercent(address: string) {
   //    let totalBurnedString = await this.getTotalNetworkBurned(address);
   //    let isHex = /^0x[0-9A-Fa-f]+$/.test(totalBurnedString);

   //    let totalBurnedBN = new BN(totalBurnedString, isHex ? 16 : 10);

   //    let firstThresholdAmountBN = new BN('200000000');
   //    let percentageBN = new BN('8000000'); // 0.008 * 10^6 to maintain precision without decimals

   //    if (totalBurnedBN.lte(firstThresholdAmountBN)) {
   //       return percentageBN.toNumber() / 10 ** 6;
   //    }

   //    let excessAmountBN = totalBurnedBN.sub(firstThresholdAmountBN);
   //    let reductionsBN = excessAmountBN.div(new BN('100000000')).add(new BN(1));

   //    for (let i = new BN(0); i.lt(reductionsBN); i.iadd(new BN(1))) {
   //       percentageBN = percentageBN.div(new BN(2));
   //    }

   //    return percentageBN.toNumber() / 10 ** 6;
   // }

}

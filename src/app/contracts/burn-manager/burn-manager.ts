import { CurrencyTickerEnum, Utils } from "app/utils/utils";
import { environment } from "environments/environment";
import { BN } from '@polkadot/util';
import { GasLimits } from "app/types";
import { AppError } from "app/utils/app-error/app-error";
import { ContractPromise } from "app/utils/api-contract";
export class BurnManager {
   contract: ContractPromise;
   gasLimits: GasLimits;
   constructor(contract: any, gasLimits: GasLimits) {
      this.contract = contract;
      this.gasLimits = gasLimits;
   }

   Errors = {
      GettingTotalNetworkBurned: "BurnManager::ErrorGettingTotalNetworkBurned",
      GettingBurnPortfolio: "BurnManager::ErrorGettingBurnPortfolio",

   }

   async makeBurnTx(amount: number) {

      return await this.contract.tx['burn']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
         value: Utils.toBigNumberString(amount, CurrencyTickerEnum.D9)
      }, environment.contracts.burn.address)
   }

   async makeWithdrawTx() {
      // const contract = await this.contractsService.getContract(environment.contracts.burn_manager);
      return await this.contract.tx['withdraw']({
         gasLimit: this.gasLimits.writeLimit,
         storageDepositLimit: environment.storage_deposit_limit,
      }, environment.contracts.burn.address)
   }

   async getBurnPortfolio(address: string) {
      // const contract = await this.contractsService.getContract(environment.contracts.burn_manager);
      const { result, output } = await this.contract.query['getPortfolio'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit
      }, address);

      if (result.isOk && output != null) {
         console.log("burn portfolio result is ", result.toJSON())
         console.log("burn portfolio output is ", output.toJSON())
         let burnPortfolio = (output!.toJSON()! as any).ok
         console.log(burnPortfolio)
         if (burnPortfolio) {
            burnPortfolio.amountBurned = Utils.reduceByCurrencyDecimal(burnPortfolio.amountBurned, CurrencyTickerEnum.D9);
            burnPortfolio.balanceDue = Utils.reduceByCurrencyDecimal(burnPortfolio.balanceDue, CurrencyTickerEnum.D9);
            burnPortfolio.balancePaid = Utils.reduceByCurrencyDecimal(burnPortfolio.balancePaid, CurrencyTickerEnum.D9);
         }
         return burnPortfolio;
      }
      else {
         throw new AppError("Error getting burn portfolio.");
      }
   }
   /**
    * @description total burned by whole network
    */
   async getTotalNetworkBurned(address: string): Promise<string> {
      console.log("total burned called")
      // const contract = await this.contractsService.getContract(environment.contracts.burn_manager);
      const { output, result } = await this.contract.query['getTotalBurned'](address, {
         gasLimit: this.gasLimits.readLimit,
         storageDepositLimit: environment.storage_deposit_limit
      });
      console.log("output is ", output)
      console.log("result is ", result.toJSON())
      if (output) {
         console.log("total burned", (output!.toJSON()! as any).ok)
         const totalBurned = (output!.toJSON()! as any).ok
         //polkadot api may return string or number depending 
         //on the size of the number. small numbers are returned as numbers
         // large are returned as hex strings
         return typeof totalBurned === 'string' ? totalBurned : totalBurned.toString();
      }
      else {
         throw Error(this.Errors.GettingTotalNetworkBurned);
      }

   }
   /**
    * @description the network daily return is determined by the total amount burned by the network.
    * @returns percentage of return
    */
   async getReturnPercent(address: string) {
      let totalBurnedString = await this.getTotalNetworkBurned(address);
      let isHex = /^0x[0-9A-Fa-f]+$/.test(totalBurnedString);

      let totalBurnedBN = new BN(totalBurnedString, isHex ? 16 : 10);

      let firstThresholdAmountBN = new BN('200000000');
      let percentageBN = new BN('8000000'); // 0.008 * 10^6 to maintain precision without decimals

      if (totalBurnedBN.lte(firstThresholdAmountBN)) {
         return percentageBN.toNumber() / 10 ** 6;
      }

      let excessAmountBN = totalBurnedBN.sub(firstThresholdAmountBN);
      let reductionsBN = excessAmountBN.div(new BN('100000000')).add(new BN(1));

      for (let i = new BN(0); i.lt(reductionsBN); i.iadd(new BN(1))) {
         percentageBN = percentageBN.div(new BN(2));
      }

      return percentageBN.toNumber() / 10 ** 6;
   }

}

import { ContractsService } from "app/services/contracts/contracts.service";
import { CurrencyTickerEnum, Utils } from "app/utils/utils";
import { environment } from "environments/environment";
import { BN } from '@polkadot/util';
import { D9ApiService } from "app/services/d9-api/d9-api.service";
export class BurnManager {
   constructor(private contractsService: ContractsService, private d9: D9ApiService) {

   }

   async makeBurnTx(amount: number) {
      const contract = await this.contractsService.getContract(environment.contracts.burn_manager)
      return await contract.tx['burn']({
         gasLimit: await this.d9.getGasLimit(),
         storageDepositLimit: environment.storage_deposit_limit,
         value: Utils.toBigNumberString(amount, CurrencyTickerEnum.D9)
      }, environment.contracts.burn.address)
   }

   async makeWithdrawTx() {
      const contract = await this.contractsService.getContract(environment.contracts.burn_manager);
      return await contract.tx['withdraw']({
         gasLimit: await this.d9.getGasLimit(),
         storageDepositLimit: environment.storage_deposit_limit,
      }, environment.contracts.burn.address)
   }

   async getBurnPortfolio(address: string) {
      const contract = await this.contractsService.getContract(environment.contracts.burn_manager);
      const { result, output } = await contract.query['getPortfolio'](address, {
         gasLimit: await this.d9.getReadGasLimit(),
         storageDepositLimit: environment.storage_deposit_limit
      }, address);

      if (result.isOk && output != null) {
         // sendNotification()
         let burnPortfolio = (output!.toJSON()! as any).ok
         console.log(burnPortfolio)
         if (burnPortfolio) {
            burnPortfolio.amountBurned = Utils.reduceByCurrencyDecimal(burnPortfolio.amountBurned, CurrencyTickerEnum.D9);
            burnPortfolio.balanceDue = Utils.reduceByCurrencyDecimal(burnPortfolio.balanceDue, CurrencyTickerEnum.D9);
            burnPortfolio.balancePaid = Utils.reduceByCurrencyDecimal(burnPortfolio.balancePaid, CurrencyTickerEnum.D9);
         }
      }
   }
   /**
    * @description total burned by whole network
    */
   async getTotalNetworkBurned(address: string): Promise<string> {
      console.log("total burned called")
      const contract = await this.contractsService.getContract(environment.contracts.burn_manager);
      const { output } = await contract.query['getTotalBurned'](address, {
         gasLimit: await this.d9.getReadGasLimit(),
         storageDepositLimit: environment.storage_deposit_limit
      });
      if (output) {
         console.log("total burned", (output!.toJSON()! as any).ok)
         const totalBurned = (output!.toJSON()! as any).ok
         //polkadot api may return string or number depending 
         //on the size of the number. small numbers are returned as numbers
         // large are returned as hex strings
         return typeof totalBurned === 'string' ? totalBurned : totalBurned.toString();
      }
      else {
         throw Error("ErrorGettingTotalBurned");
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

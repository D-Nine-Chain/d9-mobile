import { AssetsService } from "app/services/asset/asset.service";
import { D9ApiService } from "app/services/d9-api/d9-api.service";
import { CurrencyTickerEnum, Utils } from "app/utils/utils";
import { environment } from "environments/environment";

export class BurnManager {
   constructor(private d9Api: D9ApiService, private assetsService: AssetsService) {

   }

   async makeBurnTx(amount: number) {
      const contract = await this.d9Api.getContract(environment.contracts.burn_manager)
      return await contract.tx['burn']({
         gasLimit: await this.d9Api.getGasLimit(),
         storageDepositLimit: environment.storage_deposit_limit,
         value: Utils.toBigNumberString(amount, CurrencyTickerEnum.D9)
      }, environment.contracts.burn.address)
   }

   async makeWithdrawTx() {
      const contract = await this.d9Api.getContract(environment.contracts.burn_manager);
      return await contract.tx['withdraw']({
         gasLimit: await this.d9Api.getGasLimit(),
         storageDepositLimit: environment.storage_deposit_limit,
      }, environment.contracts.burn.address)
   }

   async getBurnPortfolio(address: string) {
      const contract = await this.d9Api.getContract(environment.contracts.burn_manager);
      const { result, output } = await contract.query['getPortfolio'](address, {
         gasLimit: await this.d9Api.getReadGasLimit(),
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
            this.assetsService.updateBurnPortfolio(burnPortfolio);
         }
      }
   }
   /**
    * @description total burned by whole network
    */
   async getTotalNetworkBurned(address: string) {
      console.log("total burned called")
      const contract = await this.d9Api.getContract(environment.contracts.burn_manager);
      const { output } = await contract.query['getTotalBurned'](address, {
         gasLimit: await this.d9Api.getReadGasLimit(),
         storageDepositLimit: environment.storage_deposit_limit
      });
      if (output) {
         console.log("total burned", (output!.toJSON()! as any).ok)
         this.assetsService.updateNetworkBurn(Utils.reduceByCurrencyDecimal((output!.toJSON()! as any).ok, CurrencyTickerEnum.D9));

      }

   }
   /**
    * @description the network daily return is determined by the total amount burned by the network.
    * @returns percentage of return
    */
   getReturnPercent() {
      let totalBurned = this.assetsService.getNetworkBurn();
      let firstThresholdAmount = 200_000_000; // Reduced by 10^12
      let percentage = 0.008;

      if (totalBurned <= firstThresholdAmount) {
         return percentage;
      }

      let excessAmount = totalBurned - firstThresholdAmount;
      let reductions = Math.floor(excessAmount / 100_000_000) + 1; // Reduced by 10^12

      for (let i = 0; i < reductions; i++) {
         percentage /= 2;
      }

      return percentage;


   }

}

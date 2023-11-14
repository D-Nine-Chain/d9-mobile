import { Injectable } from '@angular/core';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { GenericContractService } from 'app/services/contracts/generic-contract/generic-contract.service';
import { TransactionsService } from 'app/services/transactions/transactions.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { environment } from 'environments/environment';
import { MerchantAccount } from 'app/types';
import { MerchantManager } from 'app/contracts/merchant-manager/merchant-manager';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
@Injectable({
   providedIn: 'root'
})
export class MerchantMiningService extends GenericContractService implements GenericContractService {

   constructor(wallet: WalletService, transaction: TransactionsService, d9: D9ApiService) {
      super(wallet, transaction, d9);
      this.initManager(environment.contracts.merchant.name)
         .then((merchantManager: MerchantManager) => {
            return this.initObservables(merchantManager)
         })
         .then(() => {
            console.log("observables initialized")
         })
         .catch((err) => {
            console.log("error in prepping contract ", err)
         })
   }

   public getMerchantExpiryObservable() {
      return this.getObservable<number>("merchant_expiry");
   }

   public getMerchantObservable() {
      return this.getObservable<MerchantAccount>("merchant_account");
   }

   public async updateData(): Promise<void> {
      const merchantManager = await this.getManager<MerchantManager>(environment.contracts.merchant.name);
      await this.initObservables(merchantManager);

   }


   private async initObservables(merchantManager: MerchantManager) {
      console.log("observables initialized")
      await this.updateDataFromChain<Date>("merchant_expiry", merchantManager.getMerchantExpiry, this.formatExpiry);

      await this.updateDataFromChain<MerchantAccount>("merchant_account", merchantManager.getMerchantAccount, this.formatMerchantAccount);
   }

   private formatExpiry(expiry: number): Date {
      return new Date(expiry)
   }

   private formatMerchantAccount(merchantAccount: any): MerchantAccount {
      const formattedMerchantAccount: MerchantAccount = {
         greenPoints: Utils.reduceByCurrencyDecimal(merchantAccount.greenPoints, CurrencyTickerEnum.D9),
         lastConversion: merchantAccount.lastConversion,
         redeemedUsdt: Utils.reduceByCurrencyDecimal(merchantAccount.redeemedUsdt, CurrencyTickerEnum.USDT),
         redeemedD9: Utils.reduceByCurrencyDecimal(merchantAccount.redeemedD9, CurrencyTickerEnum.D9),
         createdAt: merchantAccount,
         expiry: merchantAccount.expiry,
      }
      return formattedMerchantAccount;
   }

}
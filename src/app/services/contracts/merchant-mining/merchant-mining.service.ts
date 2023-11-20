import { Injectable } from '@angular/core';
import { D9ApiService } from 'app/services/d9-api/d9-api.service';
import { GenericContractService } from 'app/services/contracts/generic-contract/generic-contract.service';
import { TransactionsService } from 'app/services/transactions/transactions.service';
import { WalletService } from 'app/services/wallet/wallet.service';
import { environment } from 'environments/environment';
import { MerchantAccount } from 'app/types';
import { MerchantManager } from 'app/contracts/merchant-manager/merchant-manager';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { firstValueFrom, switchMap } from 'rxjs';
@Injectable({
   providedIn: 'root'
})
export class MerchantMiningService extends GenericContractService implements GenericContractService {
   merchantManagerKey = "merchant_manager";
   merchantAccountKey = "merchant_account";
   merchantExpiryKey = "merchant_expiry";
   userAddress: string | null = null;
   constructor(wallet: WalletService, transaction: TransactionsService, d9: D9ApiService) {
      super(wallet, transaction, d9);
      this.init().catch((err) => {
         console.log(err)
      })
   }
   async init() {
      const manager = await this.initManager(this.merchantManagerKey, environment.contracts.merchant.name)
      await this.initObservables(manager)

   }
   public async withdrawD9(amount: number) {
      const updatePromises = [
         this.updateAccountFromChain(),
      ]
      this.currentTransactionSub = this.wallet.getActiveAddressObservable()
         .pipe(switchMap(address => {
            return this.executeWriteTransaction(this.merchantManagerKey, 'redeemD9', [address], updatePromises)
         })).subscribe();
   }

   public async subscribe(months: number) {
      this.currentTransactionSub = this.wallet.getActiveAddressObservable()
         .pipe(switchMap(address => {
            return this.executeWriteTransaction(this.merchantManagerKey, 'd9Subscribe', [months])
         })).subscribe();
   }

   public async sendGreenPoints(toAddress: string, amount: number) {
      const updatePromises = [
         this.updateAccountFromChain(),
      ]
      return this.executeWriteTransaction(this.merchantManagerKey, 'giveGreenPoints', [toAddress, amount], updatePromises)
   }

   public getMerchantExpiryObservable() {
      return this.getObservable<Date>(this.merchantExpiryKey);
   }

   public getMerchantObservable() {
      return this.getObservable<MerchantAccount>(this.merchantAccountKey);
   }

   public async updateData(): Promise<void> {
      const merchantManager = await this.getManager<MerchantManager>(this.merchantManagerKey);
      await this.initObservables(merchantManager);

   }

   private async updateAccountFromChain(): Promise<void> {
      console.log("updating account from chain")
      return firstValueFrom(this.wallet.getActiveAddressObservable().pipe(
         switchMap(async (account) => this.updateDataFromChain<MerchantAccount>(this.merchantAccountKey, (await this.getManager<MerchantManager>(this.merchantManagerKey)).getMerchantAccount(this.userAddress!), this.formatMerchantAccount))
      ))
   }

   private async updateExpiryFromChain(): Promise<void> {
      return firstValueFrom(this.wallet.getActiveAddressObservable().pipe(
         switchMap(async (account) => this.updateDataFromChain<Date>(this.merchantExpiryKey, (await this.getManager<MerchantManager>(this.merchantManagerKey)).getMerchantExpiry(this.userAddress!), this.formatExpiry))
      ))
   }

   private async initObservables(merchantManager: MerchantManager) {

      this.initObservable<MerchantAccount>(this.merchantAccountKey, {
         greenPoints: Utils.reduceByCurrencyDecimal(0, CurrencyTickerEnum.D9),
         lastConversion: 0,
         redeemedUsdt: Utils.reduceByCurrencyDecimal(0, CurrencyTickerEnum.USDT),
         redeemedD9: Utils.reduceByCurrencyDecimal(0, CurrencyTickerEnum.D9),
         createdAt: 0,
         expiry: 0,
      });

      this.initObservable<Date>(this.merchantExpiryKey, new Date(0));

      this.wallet.getActiveAddressObservable()
         .subscribe(async (address) => {
            if (address) {
               const getMerchantAccountPromise = merchantManager.getMerchantAccount(address)
               await this.updateDataFromChain<MerchantAccount>(this.merchantAccountKey, getMerchantAccountPromise, this.formatMerchantAccount);
               const getExpiryPromise = merchantManager.getMerchantExpiry(address)
               await this.updateDataFromChain<Date>(this.merchantExpiryKey, getExpiryPromise, this.formatExpiry);
            }
         })
      this.observablesInitializedSubject.next(true);
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
import { Injectable } from '@angular/core';
import { WalletService } from '../wallet/wallet.service';
import { TransactionsService } from '../transactions/transactions.service';
import { UsdtService } from '../contracts/usdt/usdt.service';
import { firstValueFrom, switchMap } from 'rxjs';
import { environment } from 'environments/environment';
import { Commit } from 'app/types';
import { ChainEnum } from 'app/utils/utils';
import { env } from 'process';

@Injectable({
   providedIn: 'root'
})
export class CrossChainTransferService {

   constructor(private wallet: WalletService, private transaction: TransactionsService, private usdt: UsdtService) {

   }
   /**
    * see the current allowance amount that the user granted to  cross transfer wallet 
    * @returns {number} the current allowance that current address has given to cross transfer contract
    */
   getAllowanceAmount() {
      const cross_address = environment.contracts.cross_chain_transfer.address
      return this.usdt.allowancePromise(cross_address)
         .then((allowance) => {
            return allowance / 100;
         })
   }

   /**
    * if allowance is insufficient, increase allowance by the increaseAmount.
    * this is a delta change. x + increaseAmount. e.g. if x = 100 and increaseAmount = 50, then the new allowance will be 150
    * @param increaseAmount 
    * @returns 
    */
   increaseAllowancePromise(increaseAmount: number): Promise<void> {
      const cross_address = environment.contracts.cross_chain_transfer.address
      return this.usdt.increaseAllowance(cross_address, increaseAmount)
   }
   /**
    * get a transactionID to start transaction
    * @returns {string} transactionID
    */
   getTransactionID() {
      return firstValueFrom(this.wallet.activeAddressObservable())
         .then((address) => {
            return fetch(environment.contracts.cross_chain_transfer + `transfer/id/next/${address}`)
         })
         .then((response) => {
            return response.json()
         })
         .then((json) => {
            return json as string;
         })
   }


   startD9ToTronTransfer(tronAddress: string, amount: number) {
      return this.getTransactionID()
         .then((transactionId) => {
            return this.createToTronData(transactionId, tronAddress, amount)
         })
         .then((commit) => {
            return this.callApiCreateCommit(commit)
         })
   }

   callApiCreateCommit(commit: Commit): Promise<any> {
      return fetch(environment.contracts.cross_chain_transfer + `transfer/commit`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(commit)
      })
         .then((response) => {
            return response.json()
         })
   }

   finishD9ToTronTransfer(commit: Commit) {
      return fetch(environment.contracts.cross_chain_transfer + `transfer/dispatch`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(commit)
      })
         .then((response) => {
            return response.json()
         })
   }

   /**
    * create data that represents a transaction of USDT from d9 to Tron
    * @param transactionId {string} the transaction id that was created by the cross chain transfer contract
    * @param tronAddress {string} the tron address that the user wants to send to
    * @param amount {number} the usdt amount in normal form (e.g. 123.87 and not 123867 )
    * @returns {Commit} the commit object that will be sent to the cross chain transfer api
    */
   createToTronData(transactionId: string, tronAddress: string, amount: number): Promise<Commit> {
      return firstValueFrom(this.wallet.activeAddressObservable())
         .then((address) => {
            return {
               transactionId: transactionId,
               toAddress: tronAddress,
               amount: amount,
               fromAddress: address!,
               fromChain: ChainEnum.D9,
               toChain: ChainEnum.TRON
            } as Commit
         })
   }
}


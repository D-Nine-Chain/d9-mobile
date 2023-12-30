import { Injectable } from '@angular/core';
import { WalletService } from '../../wallet/wallet.service';
import { D9ApiService } from '../../d9-api/d9-api.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Subscription, catchError, combineLatest, distinctUntilChanged, filter, firstValueFrom, from, lastValueFrom, map, switchMap, take, tap } from 'rxjs';
import { UsdtManager } from 'app/contracts/usdt-manager/usdt-manager';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { Abi } from '@polkadot/api-contract';
import { ContractUtils } from 'app/contracts/contract-utils/contract-utils';
@Injectable({
   providedIn: 'root'
})
export class UsdtService {
   private usdtManager: UsdtManager | null = null;
   private allowanceSubject = new BehaviorSubject<number>(0);
   private usdtBalanceSubject = new BehaviorSubject<number>(0);
   private addressSub: Subscription | null = null;
   private usdtManagerSubject = new BehaviorSubject<UsdtManager | null>(null);
   constructor(private d9: D9ApiService, private transaction: TransactionsService, private wallet: WalletService) {
      this.init().catch((err) => {
         console.log(err)
      })
   }

   public async init() {
      this.usdtManager = await this.d9.getContract(environment.contracts.usdt.name)
      this.usdtManagerSubject.next(this.usdtManager);
      this.watchEvents()
         .subscribe()
   }

   getUsdtBalancePromise() {
      return lastValueFrom(this.balanceObservable().pipe(
         catchError(err => {
            console.log('Error in stream', err);
            throw err;
         }),
         tap(balance => console.log("tapped balance promise is ", balance)),
         filter(balance => balance != null),
         take(1),
      ))
   }

   balanceObservable() {
      return this.wallet.activeAddressObservable()
         .pipe(
            distinctUntilChanged(), // only emit when the current value is different than the last
            switchMap((address) => {
               return from(this.updateBalance(address!))
            }),
            map((balance) => { return balance ?? 0 }),
            switchMap((balance) => {
               this.usdtBalanceSubject.next(balance);
               return this.usdtBalanceSubject.asObservable()
            })
         )
   }


   allowancePromise(forWhoAddress: string) {
      return firstValueFrom(this.allowanceObservable(forWhoAddress))
   }
   /**
    * @description increasse allowance for some contract
    * @param forWhoAddress the requester of allowance
    * @returns 
    */
   allowanceObservable(forWhoAddress: string) {
      return this.wallet.activeAddressObservable()
         .pipe(
            distinctUntilChanged(),
            switchMap((address) => {
               return from(this.getCurrentAllowance(address!, forWhoAddress))
            }),
            map((allowance) => { return allowance ?? 0 }),
            switchMap((allowance) => {
               this.allowanceSubject.next(allowance);
               return this.allowanceSubject.asObservable()
            })
         )
   }

   transfer(toAddress: string, amount: number) {
      let userAddress: string | null = null;
      let sub = combineLatest(
         [
            this.usdtManagerSubject.asObservable(),
            this.wallet.activeAddressObservable()
         ]
      ).pipe(
         filter(([manager, address]) => manager != null && address != null),
         take(1),
         tap(([_, address]) => userAddress = address),
         map(([manager, _]) => {
            if (!manager || !userAddress) {
               throw new Error("Could not get manager or user address");
            }
            return manager.transfer(toAddress, amount);
         }),
         switchMap((tx) => {
            return from(this.wallet.signTransaction(tx));
         }),
         switchMap((signedTx) => {
            return this.transaction.sendSignedTransaction(signedTx);
         }),
         tap((result) => {
            if (result.status.isFinalized && userAddress) {
               this.updateBalance(userAddress);
               sub.unsubscribe();
            }
         })
      ).subscribe();
   }

   async increaseAllowance(forWhoAddress: string, increaseByAmount: number) {
      const userAddress = await this.wallet.getAddressPromise();
      if (!userAddress) {
         throw new Error("no address")
      }
      console.log('increase allowance called')
      const tx = this.usdtManager?.increaseAllowance(forWhoAddress, increaseByAmount)
      if (!tx) {
         throw new Error("could not create tx")
      }
      const signedTransaction = await this.wallet.signTransaction(tx);
      const sub = this.transaction.sendSignedTransaction(signedTransaction)
         .subscribe((result) => {
            console.log("result is ", result)
            if (result.status.isFinalized) {
               this.getCurrentAllowance(userAddress, forWhoAddress)
               sub.unsubscribe()
            }
         })
   }

   public async setAllowance(approveWho: string, amount: number) {
      const userAddress = await this.wallet.getAddressPromise();
      console.log(`approve usdt called with ${approveWho} and ${amount}`)
      const tx = this.usdtManager?.approve(approveWho, amount)
      if (!tx) {
         throw new Error("could not create tx")
      }
      const signedTransaction = await this.wallet.signTransaction(tx);
      const sub = this.transaction.sendSignedTransaction(signedTransaction)
         .subscribe((result) => {
            console.log("result is ", result)
            if (result.status.isFinalized) {
               this.getCurrentAllowance(userAddress!, approveWho)
               sub.unsubscribe()
            }
         })
   }

   regularUSDTBalanceCheck() {
      return this.wallet.activeAddressObservable()
         .pipe(
            tap((address) => {
               setInterval(async () => {
                  await this.updateBalance(address!)
               }, 6000)
            })
         )
   }

   updateBalance(userAddress: string): Promise<number | null> {
      return firstValueFrom(this.usdtManagerSubject.asObservable()
         .pipe(
            filter((manager) => manager != null),
            switchMap((manager) => {
               return from(manager!.getBalance(userAddress))
            }),
            map((outcome) => {
               return this.transaction.processReadOutcomes(outcome, this.formatUsdtBalance)
            }),
            tap((balance) => {
               this.usdtBalanceSubject.next(balance ?? 0);
            })
         ))
   }

   async getCurrentAllowance(userAddress: string, forWho: string) {
      return firstValueFrom(this.usdtManagerSubject.asObservable()
         .pipe(
            filter((manager) => manager != null),
            take(1),
            switchMap((manager) => {
               return from(manager!.getAllowance(userAddress, forWho))
            }),
            map((outcome) => {
               return this.transaction.processReadOutcomes(outcome, this.formatUsdtBalance)
            }),
            tap((allowance) => {
               console.log("allowance is ", allowance)
               this.allowanceSubject.next(allowance ?? 0);
            })
         ))
   }

   public formatUsdtBalance(balance: string | number) {
      return Utils.reduceByCurrencyDecimal(balance, CurrencyTickerEnum.USDT)
   }

   private watchEvents() {
      return combineLatest([
         this.d9.getApiObservable(),
         this.usdtManagerSubject.asObservable()
      ]).pipe(
         switchMap(([api, contract]) => api.query.system.events().pipe(
            map(events => ({ events, contract }))
         )),
         tap(({ events, contract }) => this.processEvents(contract, events))
      );
   }


   private async processEvents(contract: any, events: any) {
      console.log("events are ", events)
      events.forEach(async (record: any) => {
         // Extract the phase, event and the event types
         const { event, phase } = record;
         const types = event.typeDef;
         const abi = (await ContractUtils.getContractMetadata(environment.contracts.main_pool.name)).abi;
         const contractAbi = new Abi(abi)
         // Show what we are busy with
         console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
         console.log("event data is ", event.data.toJSON())
         if (event.section == "contracts" && event.method == "ContractEmitted") {
            console.log("contract emitted event")
            const [emittedContractAddress, data] = event.data;
            console.log("emitted contract address is ", emittedContractAddress)
            const decodedData = contractAbi.decodeEvent(data);
            console.log("decoded data to json", decodedData)
            const eventArgs = decodedData.args;
            eventArgs.forEach((arg: any) => {
               console.log("arg is ", arg)
               console.log("arg is ", arg.toJSON())
            })
            console.log("Contract emitted event:", decodedData.event);


         }
         // console.log("phase is :", phase.toJSON())
         // Loop through each of the parameters, displaying the type and data
         event.data.forEach((data: any, index: any) => {
            console.log(`\t\t\t${types[index].type}: ${data.toJSON()}`);
            console.log("perhaps decoded data is :", data.toJSON())
         });
      });
   }

}

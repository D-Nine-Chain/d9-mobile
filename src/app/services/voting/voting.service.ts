import { Injectable } from '@angular/core';
import { WalletService } from '../wallet/wallet.service';
import { D9ApiService } from '../d9-api/d9-api.service';
import { Observable, firstValueFrom, from, map, switchMap } from 'rxjs';
import { ValidatorInfo } from 'app/types';
import { TransactionsService } from '../transactions/transactions.service';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { environment } from 'environments/environment';

@Injectable({
   providedIn: 'root'
})
export class VotingService {

   constructor(
      private d9: D9ApiService, private wallet: WalletService, private transaction: TransactionsService
   ) {
      this.d9.getApiObservable().subscribe((d9) => {
         console.log("d9 query", d9.tx['d9BurnElection'])
      })
   }

   addVotingInterest(amount: number) {
      this.wallet.activeAddressObservable().pipe(
         switchMap(
            address => this.d9.getApiObservable().pipe(
               switchMap(d9 => {
                  const tx = d9.tx['d9BurnElection']['addVotingInterest'](
                     address,
                     environment.contracts.main_pool.address,
                     Utils.toBigNumberString(amount, CurrencyTickerEnum.D9),
                     environment.contracts.burn_miner.address
                  );
                  return from(this.wallet.signTransaction(tx))
               }),
               switchMap((signedTx) => {
                  return this.transaction.sendSignedTransaction(signedTx)
               })
            )
         )
      )
         .subscribe((result) => {
            console.log("result", result)
         })
   }

   /**
    * voting interest how how much voting power a user has
    * @returns {Observable<UserVotingInterest | null >} voting interest defines how a user's votes are distributed
    */
   getVotingInterest() {
      return this.wallet.activeAddressObservable().pipe(
         switchMap(
            address => from(this.d9.getApiPromise()).pipe(
               switchMap(d9 => d9.query['d9BurnElection']['usersVotingInterests'](address)),
               map((interest) => { return interest.toJSON() })
            )
         )
      )
   }
   /**
    * the candidates that a user can choose to distribute their votes.
    * the list is sorted by the number of votes each candidate has (most to least)
    * @returns {Observable<String[]>} list of candidates
    */
   getSortedCandidates() {
      return this.d9.getApiObservable().pipe(
         switchMap(
            d9 => (d9.rpc as any).voting.getSortedCandidates()
         ),
         map((rpcCall: any) => { return rpcCall.toJSON() })
      )
   }
   /**
    * the total number of votes that a candidate has accumulated 
    *  
    * @param candidate address of the candidate
    * @returns {Observable<number>} candidate's total votes
    */
   getCandidateAccumulativeVotes(candidate: string) {
      return from(this.d9.getApiPromise()).pipe(
         switchMap(d9 => d9.query['d9BurnElection']['candidateAccumulativeVotes'](candidate)),
         map((interest) => { return interest.toJSON() })
      )
   }

   /**
    * total number of candidates. will always be less than 300. 
    *  
    * @returns {Observable<number>} number of candidates
    */
   getCurrentNumberOfCandidates() {
      return from(this.d9.getApiPromise()).pipe(
         switchMap(d9 => d9.query['d9BurnElection']['currentNumberOfCandidates']()),
         map((numberOfCandidates) => { return numberOfCandidates.toJSON() })
      )
   }

   /**
   * get info on an existing validator
   *  @param address address of the validator
   * @returns {Observable<ValidatorInfo | null> } validator info for a validator or null if the address is not a validator
   */
   validatorInfo(address: string): Observable<ValidatorInfo | null> {
      return this.d9.getApiObservable().pipe(
         switchMap(d9 => d9.query['d9BurnElection']['currentValidators'](address)),
         map((validator) => {
            console.log("validators", validator)
            return (validator.toJSON() as any) as ValidatorInfo | null
         })
      )
   }
   /**
    * 
    * @param address 
    * @returns 
    */
   voteDelegations(address?: string): Observable<number[] | number> {
      return this.wallet.activeAddressObservable().pipe(
         switchMap(
            address => this.d9.getApiObservable().pipe(
               switchMap(d9 => d9.query['d9BurnElection']['voteDelegations'](address)),
               map((delegations) => {
                  console.log("delegations", delegations)
                  return delegations.toJSON() as number[] | number
               })
            )
         )
      )
   }

   allVoteDelegations(): Observable<number[] | number> {
      return this.voteDelegations()
   }
}
/*!SECTION

*/
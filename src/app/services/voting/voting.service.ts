import { Injectable } from '@angular/core';
import { WalletService } from '../wallet/wallet.service';
import { D9ApiService } from '../d9-api/d9-api.service';
import { Observable, firstValueFrom, from, map, switchMap, tap } from 'rxjs';
import { Candidate, ValidatorInfo, VoteDelegatee, VoteDelegation, VotingInterest } from 'app/types';
import { TransactionsService } from '../transactions/transactions.service';
import { CurrencyTickerEnum, Utils } from 'app/utils/utils';
import { environment } from 'environments/environment';
import { BN } from "@polkadot/util";
import type { WeightV2 } from '@polkadot/types/interfaces'
@Injectable({
   providedIn: 'root'
})
export class VotingService {

   constructor(
      private d9: D9ApiService, private wallet: WalletService, private transaction: TransactionsService
   ) {

      this.d9.getApiObservable().subscribe((d9) => {
         // console.log("d9 query", d9.query["d9NodeVoting"])
         console.log("d9 query", d9.tx["d9NodeVoting"])

      })
   }
   /**
    *  @description get information on a current validator
    * @returns {Observable<ValidatorInfo>} list of validators
    */
   getCurrentValidatorInfo(validatorId: string): Observable<ValidatorInfo> {
      return this.d9.getApiObservable().pipe(
         switchMap(d9 => {
            return d9.query['d9NodeVoting']['currentValidators'](validatorId)
         }),
         map((validator) => {
            return (validator.toJSON() as any) as ValidatorInfo
         })
      )
   }
   /**
    * @description get the candidates that a user voted for 
    * @returns {Observable<VoteDelegatee[]>} list of candidates that a user voted for 
    */
   getVoteDelegations(): Observable<VoteDelegatee[]> {
      return this.wallet.activeAddressObservable().pipe(
         switchMap(address => this.d9.getApiObservable().pipe(
            switchMap(d9 => {
               let mapping = d9.query['d9NodeVoting']['voteDelegations'];
               console.log("mapping is ", mapping);
               // Use the address as the partial key to query only relevant entries
               return mapping.entries(address);  // This will filter entries based on the partial key (address)
            }),
            map(entries => {
               return entries.map(([storageKey, votes]) => {
                  // Decode the key to get the actual account IDs, assuming accountId1 is the partial key you've used to query
                  const [, accountId2] = storageKey.args.map(k => k.toString());
                  console.log("Decoded key", address, accountId2);
                  // Map the account IDs and votes into the desired structure
                  return { delegatee: accountId2, votes: votes.toJSON() as number };
               });
            }),
         ))
      )
   }

   /**
    * 
    * @returns {Observable<number>} the number of candidates that can receive votes
    * @note the cap is 300 
    */
   getCurrentCandidateCount(): Observable<number> {
      return this.d9.getApiObservable().pipe(
         switchMap(d9 => {
            return d9.query['d9NodeVoting']['currentNumberOfCandidates']()
         }),
         map((count) => {
            return count.toJSON() as number
         })
      )
   }
   /**
    * this gets your a list of the candidates sorted by the number of votes they have
    * @returns {Candidate[]} list of candidates sorted by the number of votes they have
    */
   getCandidates(): Observable<Candidate[]> {
      return this.d9.getApiObservable()
         .pipe(
            switchMap(
               d9 => (d9.rpc as any).voting.getSortedCandidates()
            ),
            map((rpcCall: any) => { return rpcCall.toJSON() }
            ),
            map((candidates) => {
               return this.formatCandidates(candidates as any)
            })
         )
   }
   /**
    *  a user must first buy votes. this function will buy votes for the user
    * @param {number} amount the amount of d9 they want to burn. 1 d9 = 1 vote 
    */
   addVotingInterest(amount: number) {
      this.wallet.activeAddressObservable().pipe(
         switchMap(
            address => this.d9.getApiObservable().pipe(
               switchMap(d9 => {
                  let weight = d9.registry.createType('WeightV2', { refTime: new BN(50_000_000_000), proofSize: new BN(800_000) }) as WeightV2;
                  const tx = d9.tx['d9NodeVoting']['addVotingInterest'](
                     address,
                     environment.contracts.main_pool.address,
                     Utils.toBigNumberString(amount, CurrencyTickerEnum.D9),
                     environment.contracts.burn_miner.address,
                     weight
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
    * voting interest how how much voting power a user has. this returns the number of votes they have
    * @returns {Observable<VotingInterest | null >} voting interest defines how a user's votes are distributed
    */
   getVotingInterest(): Observable<VotingInterest | null> {
      return this.wallet.activeAddressObservable().pipe(
         switchMap(
            address => from(this.d9.getApiPromise()).pipe(
               switchMap(d9 => d9.query['d9NodeVoting']['usersVotingInterests'](address)),
               map((interest) => {
                  if (interest) {
                     return interest.toJSON() as VotingInterest | null
                  }
                  else {
                     return null;
                  }
               })
            )
         )
      )
   }
   /**
    * @description distribute votes to a single or multiple candidates
    * @param delegations {VoteDelegation[]} must be an array of addresses (AccountId) of candidates. get candidates from `getCandidates()`

    */
   delegateVotes(delegations: VoteDelegation[]) {
      this.wallet.activeAddressObservable().pipe(
         switchMap(
            address => this.d9.getApiObservable().pipe(
               switchMap(d9 => {
                  const tx = d9.tx['d9NodeVoting']['delegateVotes'](
                     delegations,
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
    * @description move all the votes from one candidate to another
    * @note this does not change the total number of votes delegated. if a user has 1000 total votes and delegated 500 and calls this function then they still have 500 delegated but to a different candidate
    * @param from from candidate
    * @param to to candidate
    */
   redistributeVotes(from: string, to: string) {
      this.d9.getApiObservable().pipe(
         switchMap(d9 => {
            const tx = d9.tx['d9NodeVoting']['redistributeVotes'](
               from,
               to
            );
            return this.wallet.signTransaction(tx)
         }),
         switchMap((signedTx) => {
            return this.transaction.sendSignedTransaction(signedTx)
         })
      )
         .subscribe((result) => {
            console.log("result", result)
         })
   }


   /**
    * @description remove `votes` from candidate
    * @param {string} candidate address of the candidate
    * @param {number} votes number of votes to remove
    * @note this will decrease the number of delegated votes
    */
   removeVotesFromCandidate(candidate: string, votes: number) {
      this.d9.getApiObservable().pipe(
         switchMap(d9 => {
            const tx = d9.tx['d9NodeVoting']['tryRemoveVotesFromCandidate'](
               candidate,
               votes
            );
            return this.wallet.signTransaction(tx)
         }),
         switchMap((signedTx) => {
            return this.transaction.sendSignedTransaction(signedTx)
         })
      )
         .subscribe((result) => {
            console.log("result", result)
         })
   }

   /**
    * the total number of votes that a candidate has accumulated 
    *  
    * @param candidate address of the candidate
    * @returns {Observable<number>} candidate's total votes
    */
   getCandidateAccumulativeVotes(candidate: string) {
      return from(this.d9.getApiPromise()).pipe(
         switchMap(d9 => d9.query['d9NodeVoting']['candidateAccumulativeVotes'](candidate)),
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

   private formatCandidates(candidates: any[]): Candidate[] {
      console.log("formating candidates", candidates)
      return candidates.map((candidate) => {
         return {
            address: candidate[0],
            votes: candidate[1]
         }
      })
   }


}
/*!SECTION

*/
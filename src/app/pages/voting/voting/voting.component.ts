import { Component, OnInit } from '@angular/core';
import { UsdtService } from 'app/services/contracts/usdt/usdt.service';
import { VotingService } from 'app/services/voting/voting.service';
import { WalletService } from 'app/services/wallet/wallet.service';

@Component({
   selector: 'app-voting',
   templateUrl: './voting.component.html',
   styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit {
   subs: any[] = []
   constructor(private voting: VotingService, private usdt: UsdtService, private wallet: WalletService) { }

   ngOnInit() {
      /**
       * get a user's voting power
       */
      let sub1 = this.voting.getVotingInterest().subscribe((interest) => {
         console.log("voting interest", interest)
      })
      this.subs.push(sub1)

      let sub2 = this.voting.getCandidates().subscribe((candidates) => {
         console.log("candidates ", candidates)
      })
      this.subs.push(sub2)

      let sub3 = this.voting.getCandidateAccumulativeVotes("ytBPqMwQPfbs9ugGHadMUjQk6VBRNWe9cRBtqPSX4eEdQR8").subscribe((votes) => {
         console.log("candidate accumulative votes", votes)
      })
      this.subs.push(sub3)

      let sub4 = this.voting.getCurrentCandidateCount().subscribe((count) => {
         console.log("current candidate count", count)
      })
      this.subs.push(sub4)

      let sub5 = this.voting.getCurrentValidatorInfo('ytBPqMwQPfbs9ugGHadMUjQk6VBRNWe9cRBtqPSX4eEdQR8').subscribe((validatorInfo) => {
         console.log("current validator info", validatorInfo)
      })
      this.subs.push(sub5)

      let sub6 = this.voting.getVoteDelegations().subscribe((delegations) => {
         console.log("delegations", delegations)
      })
   }
   /**
    * add voting power to user's account
    */
   addVote() {
      this.voting.addVotingInterest(500)
   }
   /**
    * vote for a node
    */
   delegateVotes() {
      const voteDelegation = {
         candidate: "ytBPqMwQPfbs9ugGHadMUjQk6VBRNWe9cRBtqPSX4eEdQR8", votes: 100
      }
      this.voting.delegateVotes([voteDelegation])
   }

   redistributeVotes() {
      this.voting.redistributeVotes("ytBPqMwQPfbs9ugGHadMUjQk6VBRNWe9cRBtqPSX4eEdQR8", "xK27mBoGffhi9RAqMcgc8pSeFUHxq7JenGrqUFmT5izrYLj")
   }

   removeVotes() {
      this.voting.removeVotesFromCandidate("xK27mBoGffhi9RAqMcgc8pSeFUHxq7JenGrqUFmT5izrYLj", 50)
   }

   ngOnDestroy() {
      this.subs.forEach((sub) => {
         sub.unsubscribe()
      })

   }
}
/*!query
candidateAccumulativeVotes: function memoized(args)​​
candidateSupporters: function memoized(args)​​
currentNumberOfCandidates: function memoized(args)​​
currentValidators: function memoized(args)​​
palletVersion: function memoized(args)​​
sessionCandidateList: function memoized(args)​​
usersVotingInterests: function memoized(args)​​
voteDelegations: function memoized(args)
*/

/**!tx
 * addVotingInterest: function decorated(params)​
delegateVotes: function decorated(params)​
redistributeVotes: function decorated(params)​
removeCandidacy: function decorated(params)​
submitCandidacy: function decorated(params)​
tryRemoveVotesFromCandidate: function decorated(params)
 * 
 */
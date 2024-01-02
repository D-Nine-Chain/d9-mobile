export const customRpc = {
   referral: {
      getAncestors: {
         description: 'get ancestors of a referral account',
         params: [
            {
               name: 'account',
               type: 'AccountId'
            },
            {
               name: 'at',
               type: 'Hash',
               isOptional: true
            }
         ],
         type: 'Vec<AccountId>'
      },
      getParent: {
         description: 'get parent of a referral account',
         params: [
            {
               name: 'account',
               type: 'AccountId'
            },
            {
               name: 'at',
               type: 'Hash',
               isOptional: true
            }
         ],
         type: 'AccountId'
      },
      getDirectReferralsCount: {
         description: 'get direct referrals count of a referral account',
         params: [
            {
               name: 'account',
               type: 'AccountId'
            },
            {
               name: 'at',
               type: 'Hash',
               isOptional: true
            }
         ],
         type: 'u32'
      },
   },
   voting: {
      getSortedCandidates: {
         description: 'get canidates sorted by votes',
         params: [

            {
               name: 'at',
               type: 'Hash',
               isOptional: true
            }
         ],
         type: 'Vec<(AccountId, u64)>'
      }
   }
};

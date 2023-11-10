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
      }
   }
};

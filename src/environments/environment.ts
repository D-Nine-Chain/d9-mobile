// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
   production: false,
   ws_endpoint: "wss://testnet.d9network.com:40300",
   storage_deposit_limit: null,
   secure_storage_keypair_aggregate: "d9_keyring",
   preferences_default_address: "d9_default_address",
   preferences_addresses: "d9_addresses",
   preferences_root_address: "d9_root_address",
   preferences_d9_soft_derivation_counter: "d9_soft_derivation_counter",
   preferences_assets: "d9_assets",
   constants: {
      milliseconds_per_day: 600000,
   },
   contracts: {
      burn_manager: {
         address: "ypLPGqt7U7qhAdDgC4rD5EAvrRyoCoKJGD2FoNyqHcymW2U",
         name: "d9_burn_manager",
      },
      burn_miner: {
         address: "uGMR9uUbAvgdhj9jrBGdh7JenS7GRgCJHZM89mfESrDFhfn",
         name: "d9_burn_miner"
      },
      merchant: {
         address: "uK9yapBkpux69oLqkCPxV7YBAV3xGY7ZA5Y7bdbXn31PR9s",
         name: "D9 Merchant"
      },
      amm: {
         address: "umNwVqtuXtW2Kky99wKPPXDywC3YFRcgyjtahjy8bj36SA5",
         name: "D9 AMM"
      },
      usdt: {
         address: "z4mr21CwkZW6njfyGUBFP3JGm9KeBgzD5dsYqSotrYfxuaz",
         name: "USDT"
      },
      node_reward: {
         address: "ybyN3459G8z2qdAxNTT3hbt4BXDPdb9NEa7dkGfHGMAAriB",
         name: "d9_node_reward"
      },
      mining_pool: {
         address: "wKzVvCnePUupz3StVa7RFoAVzAohg34qNcWTeyjVwDmfWpQ",
         name: "d9_mining_pool"
      },

   }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

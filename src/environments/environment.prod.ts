// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
   production: true,
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
         address: "v4GeJMACGhNDr51pqii4rA6hDmXWgBzwVrVh4AGSBztSyAP",
         name: "d9_burn_manager",
      },
      burn_miner: {
         address: "vmVC5JNeDj41ZufdvVnHP7c4hMcb8JZBkPnTvPiGibv6hxb",
         name: "d9_burn_miner"
      },
      merchant: {
         address: "wGXQwuJ4YXa9dmmjYc7MeowKxBYsgHLF7Sa9AVQGv5SwKz8",
         name: "d9_merchant_mining"
      },
      amm: {
         address: "wTL3mVzULnrnxVMdcvyCrQ3Xv5NpG6vhFmaqpgAu2NYahot",
         name: "d9_amm"
      },
      usdt: {
         address: "z4mr21CwkZW6njfyGUBFP3JGm9KeBgzD5dsYqSotrYfxuaz",
         name: "d9_usdt"
      },
      node_reward: {
         address: "ybyN3459G8z2qdAxNTT3hbt4BXDPdb9NEa7dkGfHGMAAriB",
         name: "d9_node_reward"
      },
      mining_pool: {
         address: "zNxJXSavSe7bWs4q6CqSQS27rY4SjcZpSmVUvNGdKzdSL3o",
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

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
   production: false,
   ws_endpoint: "wss://testnet.d9network.org:40300",
   // ws_endpoint: "ws://localhost:40300",
   storage_deposit_limit: null,
   secure_storage_keypair_aggregate: "d9_keyring",
   preferences_default_address: "d9_default_address",
   preferences_addresses: "d9_addresses",
   preferences_root_address: "d9_root_address",
   preferences_d9_soft_derivation_counter: "d9_soft_derivation_counter",
   preferences_assets: "d9_assets",
   cross_transfer_endpoint: "http3.82.230.0:3000/api/",
   constants: {
      milliseconds_per_day: 600000,
   },
   contracts: {
      main_pool: {
         address: "wbWmdEHVvAYm7W7XKeXsp6a1GH2uCk4oGxUTwAZczHpjQo6",
         // address: "ywFAvcZ2rTEcCKFhSMHH1yanK4UctqiVw2c7eyxixk7eHn5",
         name: "d9_burn_manager",
      },
      burn_miner: {
         // address: "uGMR9uUbAvgdhj9jrBGdh7JenS7GRgCJHZM89mfESrDFhfn",
         address: "v4TkLRA8LtUu6XGxozXt4RkuRDrTsqCikKeqRthdkuYjkvB",
         name: "d9_burn_miner"
      },
      merchant: {
         address: "voXkugLukCacWcAzUezGyPM6j4WNq46hfse5f3LHgamByrJ",
         name: "D9 Merchant"
      },
      amm: {
         address: "yerCSUuimFfmiX1Tjcg2ob99h6TXRHNH9ZoB7hNHqnetVSJ",
         name: "D9 AMM"
      },
      usdt: {
         address: "znZ2jsRKXdMbRx51UYYxS3qwGBcoHYkjm7sYzrpEcWP5MMV",
         name: "USDT"
      },
      node_reward: {
         address: "uKwBUzzdCa2bzBD9pqVfBEh6QBwgFqgGBYtcwkNFnDzxWcb",
         name: "d9_node_reward"
      },
      mining_pool: {
         address: "wKzVvCnePUupz3StVa7RFoAVzAohg34qNcWTeyjVwDmfWpQ",
         name: "d9_mining_pool"
      },
      cross_chain_transfer: {
         address: "yuEy5C1kfs9WozPALHhtwJRmp5rGGRzEvHTbwTK643MMVbR",
         name: "d9_cross_transfer"
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

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
   production: true,
   ws_endpoint: "wss://testnet.d9network.com:40300",
   storage_deposit_limit: null,
   secure_storage_keypair_aggregate: "d9_keyring",
   preferences_default_address_key: "d9_default_address",
   preferences_addresses: "d9_addresses",
   preferences_d9_hard_derivation_counter_key: "d9_hard_derivation_counter",
   preferences_assets_key: "d9_assets",
   contracts: {
      burn_manager: {
         address: "zJibRuottM52AmwWDJrAaowL9vzohwMuGjFCr8RZZ1mtcCc",
         name: "d9_burn_manager",
      },
      burn_miner: {
         address: "xXtPrHR6E6YJmRSqJ1S6wc9oKkvCn6UhTykSLdQMNJa1FTw",
         name: "d9_burn_miner"
      },
      merchant: {
         address: "uXgbtFchEBq4frLX5HH55ZM5vPDmfbJb2NYFzpow19etiQD",
         name: "d9_merchant_mining"
      },
      amm: {
         address: "xEBMqViw3aKaH4NSHHC9qjMCzFA7JQEnMa3rRPsxZaYPJFH",
         name: "d9_amm"
      },
      usdt: {
         address: "z4mr21CwkZW6njfyGUBFP3JGm9KeBgzD5dsYqSotrYfxuaz",
         name: "d9_usdt"
      }
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

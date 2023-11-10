export const environment = {
   production: true,
   ws_endpoint: "wss://testnet.d9network.com:40300",
   storage_deposit_limit: null,
   secure_storage_privatekey_key: "d9_privateKey",
   preferences_publickey_key: "d9_publicKey",
   preferences_assets_key: "d9_assets",
   contracts: {
      burn_manager: {
         address: "zcoT4v6UgbzDrx2VV75VTV2SqpYnWv8ff54njr6ddhmLyRr",
         file_name: "burn_manager"
      },
      burn: {
         address: "vsCSRPGbhAUsWxtxtAwaqex7QKYRpxd7mSKLz4LT6P1vwjg",
      },
      merchant: {
         address: "uXgbtFchEBq4frLX5HH55ZM5vPDmfbJb2NYFzpow19etiQD",
         file_name: "d9_merchant_mining"
      },
      amm: {
         address: "xEBMqViw3aKaH4NSHHC9qjMCzFA7JQEnMa3rRPsxZaYPJFH",
         file_name: "market_makers"
      },
      usdt: {
         address: "z4mr21CwkZW6njfyGUBFP3JGm9KeBgzD5dsYqSotrYfxuaz",
         file_name: "d9_usdt"
      }
   }
};

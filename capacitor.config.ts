import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
   appId: 'com.d9.mobile',
   appName: 'D9 Mobile',
   webDir: 'www',
   server: {
      androidScheme: 'https'
   },
   plugins: {
      CapacitorSQLite: {
         iosDatabaseLocation: 'Library/D9WalletDatabase',
         iosIsEncryption: true,
         iosKeychainPrefix: 'd9-mobile',
         iosBiometric: {
            biometricAuth: false,
            biometricTitle: "Biometric login for capacitor sqlite"
         },
         androidIsEncryption: true,
         // androidBiometric: {
         //    biometricAuth: false,
         //    biometricTitle: "Biometric login for capacitor sqlite",
         //    biometricSubTitle: "Log in using your biometric"
         // }
      }
   }
};

export default config;

import { BN, hexToBn } from '@polkadot/util';
import { CurrencyRecord } from 'app/types';

export enum CurrencyTickerEnum {
   D9 = "D9",
   USDT = "USDT",
   GREEN_POINTS = "GP",
   RMB = "RMB",
   LP_TOKEN = "LP_TOKEN"
}

export enum ChainEnum {
   'D9' = 'D9',
   'TRON' = 'TRON',
}


export enum CurrencySymbol {
   D9 = "𝔇",
   USDT = "$",
   GREEN_POINTS = "ℊ",
   RMB = "¥"
}

export class Utils {

   static currenciesRecord: CurrencyRecord = {
      [CurrencyTickerEnum.D9]: {
         name: "D9",
         ticker: CurrencyTickerEnum.D9,
         symbol: CurrencySymbol.D9,
         decimals: 12
      },
      [CurrencyTickerEnum.USDT]: {
         name: "USDT",
         ticker: CurrencyTickerEnum.USDT,
         symbol: CurrencySymbol.USDT,
         decimals: 2
      },
      [CurrencyTickerEnum.GREEN_POINTS]: {
         name: "Green Points",
         ticker: CurrencyTickerEnum.GREEN_POINTS,
         symbol: CurrencySymbol.GREEN_POINTS,
         decimals: 2
      },
      [CurrencyTickerEnum.RMB]: {
         name: "RMB",
         ticker: CurrencyTickerEnum.RMB,
         symbol: CurrencySymbol.RMB,
         decimals: 2
      },
      [CurrencyTickerEnum.LP_TOKEN]: {
         name: "LP Token",
         ticker: CurrencyTickerEnum.LP_TOKEN,
         symbol: CurrencySymbol.D9,
         decimals: 6
      },
   }

   static getCurrencyInfo(currency: CurrencyTickerEnum) {
      return this.currenciesRecord[currency]
   }

   static toBigNumberString(number: number | string, currency: CurrencyTickerEnum): string {
      const numberString = new BN(number).mul(new BN(10).pow(new BN(this.currenciesRecord[currency].decimals))).toString()
      return numberString
   }

   static formatNumberForUI(number: number, compact?: "long" | "short", notation?: "standard" | "scientific" | "engineering" | "compact" | undefined): string {
      return number.toLocaleString('zh-CN', { compactDisplay: compact ?? "long", maximumFractionDigits: 2, notation: notation ?? "standard" })
   }

   static reduceByCurrencyDecimal(number: string | number, currency: CurrencyTickerEnum): number {
      console.log("number is", number)
      // Check if the input is an empty string
      if (typeof number === 'string' && number.trim().length === 0) {
         return new BN(0).toNumber();
      }
      // Check if the input is a string starting with '0x'
      else if (typeof number === 'string' && number.startsWith('0x')) {
         console.log("number is and starts with 0x", number)
         return hexToBn(number).div(new BN(10).pow(new BN(this.currenciesRecord[currency].decimals))).toNumber();
      }
      // If the input is a string but not a hex string, convert it using hexToU8a
      else if (typeof number === 'string') {
         return new BN(number).div(
            new BN(10).pow(new BN(this.currenciesRecord[currency].decimals))
         ).toNumber();
      }
      // If the input is a number, handle it directly
      else if (typeof number === 'number') {
         return number / Math.pow(10, this.currenciesRecord[currency].decimals)
      }
      // If none of the above, return 0 or throw an error
      else {
         console.error('Invalid number format');
         return 0; // or throw new Error('Invalid number format');
      }
   }
}


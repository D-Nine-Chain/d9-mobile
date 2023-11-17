
import { CurrencySymbol, CurrencyTickerEnum } from "./utils/utils";
import type { WeightV2 } from '@polkadot/types/interfaces'
export interface Account {
   address: string;
   name: string;
}
// strings can be hexadecimal or decimal representations
export interface D9Balances {
   available: number | string;
   free: number | string;

   reserved: number | string;
   locked: number | string;
   vested: number | string;
   voting: number | string;
}
export interface GasLimits {
   readLimit: WeightV2,
   writeLimit: WeightV2,
}
export interface Asset {
   name: string;
   ticker: CurrencyTickerEnum;
   //what's the value in the network's base currency
   valueInBase: string;
   id?: string;
   balance?: number | string;
   decimal?: number;
   address?: string;
}
/**
 * @burn portfolio from burn manager
 * @note use human readable numbers
 */
export interface BurnPortfolio {
   amountBurned: number;
   balanceDue: number;
   balancePaid: number;
   lastBurn: {
      time: number;
      contract: string;
   };
   lastWithdrawal: {
      time: number;
      contract: string;
   };
}
/**
 * doesnt need to interact with front end directly
 *  all times in milliseconds
 */
export interface BurnMinerAccount {
   creationTimestamp: number;
   amountBurned: number;
   balanceDue: number;
   balancePaid: number;
   lastWithdrawal: number | null;
   lastBurn: number;
   referralBoostCoefficients: number[]
   lastInteraction: number
}

export interface ContractErr {
   err: string;
}
export interface MerchantAccount {
   greenPoints: number;
   lastConversion: any;
   redeemedUsdt: number;
   redeemedD9: number;
   createdAt: number;
   //locale date string
   expiry?: any;
}

export interface Notification {
   message: NotificationMessage;
   timestamp: number;
   read?: boolean;
   type: NotificationType;
}

export enum NotificationType {
   TransactionUpdate = "TransactionUpdate",
   AssetUpdate = "AssetUpdate",
}

export type NotificationMessage = TransactionStatusMessage | AssetUpdateMessage;
export type AssetUpdateMessage = {
   type: AssetUpdate;
   assetName: string; // This is the data you want to hold, similar to Rust's enum variant
};


export interface CurrencyInfo {
   name: string,
   ticker: CurrencyTickerEnum,
   symbol: CurrencySymbol,
   decimals: number
}
export enum TransactionStatusMessage {
   InBlock = "Transaction included in block",
   Finalized = "Transaction finalized",
   Broadcast = "Transaction has been broadcasted",
   Ready = "Transaction is ready",
   Future = "Transaction is scheduled for a future block",
}

export type CurrencyRecord = Record<CurrencyTickerEnum, CurrencyInfo>
export enum AssetUpdate {
   AssetReceived = "AssetReceived",
}

export type AppError = {
   title: string;
   message: string;
   data: any;
}

export type D9QrCode = {
   type: string,
   data: string | QRGreenPoints;
   version: number;
   metadata: any;
}



export type QRGreenPoints = {
   greenPoints: number,
}

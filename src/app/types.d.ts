import { CurrencySymbol, CurrencyTickerEnum } from "./utils/utils";
import type { WeightV2 } from '@polkadot/types/interfaces'
export interface Account {
   address: string;
   name: string;
}
// strings can be hexadecimal or decimal representations
export interface D9Balances {
   free: number | string;
   frozen: number | string;
   reserved: number | string;
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

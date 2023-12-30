
import { ChainEnum, CurrencySymbol, CurrencyTickerEnum } from "./utils/utils";
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
export interface GreenPointsAccount {
   greenPoints: number;
   relationshipFactors: [number, number]
   lastConversion: any;
   redeemedUsdt: number;
   redeemedD9: number;
   createdAt: number;
}
export interface GreenPointsCreated {
   accountId: string,
   greenPoints: string,
}
export interface LiquidityProvider {
   accountId: string;
   usdt: number;
   d9: number;
   lpTokens: number;
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
   data: string | MerchantQrCode,
   version: number;
   metadata: any;
}

export interface MerchantQrCode {
   accountId: string;
   validUntil: number;
}

export type QRGreenPoints = {
   greenPoints: number,
}

export interface SessionOverview {
   activeEra: number,
   currentIndex: number,
   activeEraStart: number,
   currentEra: number,
   nextElected: string[],
   validatorCount: number,
   validators: string[]
}

export interface NodeInfo {
   address: string;
   preferences?: CommissionPreference,
   bondedAccount?: string,
   preferredNominations?: Nominations,
   ledger?: LedgerInfo,
   erasRewards?: any,

}

export interface CommissionPreference {
   commission: number;
   blocked: boolean;
}

export interface Nominations {
   targets: string[];
   submittedIn: number;
   suppressed: boolean;
}

export interface LedgerInfo {
   stash: string;
   total: number | string;
   active: number | string;
   claimedRewards: any[]
}

export interface USDTAllowanceRequest {
   name: string;
   address: string;
}

// info about a validator
export interface ValidatorInfo {
   // validators identification
   accountId: string;
   // total votes received
   totalVotes: number;
   // how many votes did validator give themselves
   selfVotes: number;
   // how many votes did validator receive from their own delegators
   delegatedVotes: number;
}

export interface Commit {
   transactionId: string;
   fromAddress: string;
   toAddress: string;
   amount: number;
   fromChain: ChainEnum;
   toChain: ChainEnum;
}
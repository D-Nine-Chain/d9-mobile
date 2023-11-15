import { GasLimits } from "app/types";
import { ContractRx } from "app/utils/api-contract";

export interface D9ContractFunctions {
   [key: string]: (...args: any[]) => any; // Use a more specific function signature if possible
}

export interface D9Contract {
   contract: ContractRx;
   gasLimits: GasLimits;
}



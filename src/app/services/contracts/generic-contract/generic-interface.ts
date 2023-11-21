import { D9Contract } from "app/contracts/contracts";
import { Observable } from "rxjs";

export interface GenericContractServiceInterface {

   initObservables(manager: D9Contract): Promise<void>;
}

abstract class GenreicContractServiceInterface {
   abstract updateDataFromChain<T>(key: string, promise: Promise<any>, format?: (data: any) => T): Promise<T>;
   abstract getObservable<T>(key: string): Observable<T | null>;
   abstract executeWriteTransaction(managerKey: string, methodName: string, args: any[], updatePromises?: Promise<any>[]): Promise<void>;
}
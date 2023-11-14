import { Observable } from "rxjs";

export interface GenericContractService {
   initManager(): Promise<void>;
   initObservables(): Promise<void>;
   getObservable(): Observable<any>;
   executeTransaction(): Promise<void>;
   updateFromChain(): Promise<void>;
   initManager(): Promise<any>;
   updateData(): Promise<void>;
}
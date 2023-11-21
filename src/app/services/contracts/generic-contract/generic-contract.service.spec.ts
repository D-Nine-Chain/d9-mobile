import { TestBed } from '@angular/core/testing';

import { GenericContractServiceBase } from './generic-contract.service';

describe('GenericContractService', () => {
   let service: GenericContractServiceBase;

   beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(GenericContractServiceBase);
   });

   it('should be created', () => {
      expect(service).toBeTruthy();
   });
});

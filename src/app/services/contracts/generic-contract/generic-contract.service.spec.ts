import { TestBed } from '@angular/core/testing';

import { GenericContractService } from './generic-contract.service';

describe('GenericContractService', () => {
  let service: GenericContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

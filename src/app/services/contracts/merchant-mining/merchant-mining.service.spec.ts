import { TestBed } from '@angular/core/testing';

import { MerchantMiningService } from './merchant-mining.service';

describe('MerchantMiningService', () => {
  let service: MerchantMiningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerchantMiningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

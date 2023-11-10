import { TestBed } from '@angular/core/testing';

import { BurnMiningService } from './burn-mining.service';

describe('BurnMiningService', () => {
  let service: BurnMiningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BurnMiningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

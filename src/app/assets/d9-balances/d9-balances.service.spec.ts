import { TestBed } from '@angular/core/testing';

import { D9BalancesService } from './d9-balances.service';

describe('D9BalancesService', () => {
  let service: D9BalancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(D9BalancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

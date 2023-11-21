import { TestBed } from '@angular/core/testing';

import { AmmService } from './amm.service';

describe('AmmService', () => {
  let service: AmmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

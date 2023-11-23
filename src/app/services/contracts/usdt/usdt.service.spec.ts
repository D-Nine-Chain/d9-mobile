import { TestBed } from '@angular/core/testing';

import { UsdtService } from './usdt.service';

describe('UsdtService', () => {
  let service: UsdtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsdtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

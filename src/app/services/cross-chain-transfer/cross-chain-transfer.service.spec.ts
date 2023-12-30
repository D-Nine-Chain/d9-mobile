import { TestBed } from '@angular/core/testing';

import { CrossChainTransferService } from './cross-chain-transfer.service';

describe('CrossChainTransferService', () => {
  let service: CrossChainTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrossChainTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

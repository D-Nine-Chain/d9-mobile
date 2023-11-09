import { TestBed } from '@angular/core/testing';

import { D9ApiService } from './d9-api.service';

describe('D9ApiService', () => {
  let service: D9ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(D9ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

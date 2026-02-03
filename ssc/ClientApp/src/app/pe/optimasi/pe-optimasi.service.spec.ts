import { TestBed } from '@angular/core/testing';

import { PeOptimasiService } from './pe-optimasi.service';

describe('PeOptimasiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeOptimasiService = TestBed.get(PeOptimasiService);
    expect(service).toBeTruthy();
  });
});

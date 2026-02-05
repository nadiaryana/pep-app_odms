import { TestBed } from '@angular/core/testing';

import { PeLaporanLabService } from './pe-laporan-lab.service';

describe('PeLaporanLabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeLaporanLabService = TestBed.get(PeLaporanLabService);
    expect(service).toBeTruthy();
  });
});

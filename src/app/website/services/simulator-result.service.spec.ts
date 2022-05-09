import { TestBed } from '@angular/core/testing';

import { SimulatorResultService } from './simulator-result.service';

describe('SimulatorResultService', () => {
  let service: SimulatorResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulatorResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { QuestionsAdminService } from './questions-admin.service';

describe('QuestionsAdminService', () => {
  let service: QuestionsAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionsAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

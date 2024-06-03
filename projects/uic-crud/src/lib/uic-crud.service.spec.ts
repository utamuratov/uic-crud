import { TestBed } from '@angular/core/testing';

import { UicCrudService } from './uic-crud.service';

describe('UicCrudService', () => {
  let service: UicCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UicCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

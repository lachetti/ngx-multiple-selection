import { TestBed } from '@angular/core/testing';

import { NgxMultipleSelectionService } from './ngx-multiple-selection.service';

describe('NgxMultipleSelectionService', () => {
  let service: NgxMultipleSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMultipleSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

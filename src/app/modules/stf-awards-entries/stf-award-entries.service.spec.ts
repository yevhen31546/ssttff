/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StfAwardEntriesService } from './stf-award-entries.service';

describe('Service: StfAwardEntries', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StfAwardEntriesService]
    });
  });

  it('should ...', inject([StfAwardEntriesService], (service: StfAwardEntriesService) => {
    expect(service).toBeTruthy();
  }));
});

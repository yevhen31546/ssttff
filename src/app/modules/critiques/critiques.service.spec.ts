/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CritiquesService } from './critiques.service';

describe('Service: Critiques', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CritiquesService]
    });
  });

  it('should ...', inject([CritiquesService], (service: CritiquesService) => {
    expect(service).toBeTruthy();
  }));
});

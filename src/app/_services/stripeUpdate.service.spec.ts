/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StripeUpdateService } from './stripeUpdate.service';

describe('Service: StripeUpdate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StripeUpdateService]
    });
  });

  it('should ...', inject([StripeUpdateService], (service: StripeUpdateService) => {
    expect(service).toBeTruthy();
  }));
});

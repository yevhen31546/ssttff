/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExploreMenuService } from './explore-menu.service';

describe('Service: ExploreMenu', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExploreMenuService]
    });
  });

  it('should ...', inject([ExploreMenuService], (service: ExploreMenuService) => {
    expect(service).toBeTruthy();
  }));
});

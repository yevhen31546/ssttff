/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LayoutLoaderService } from './layout-loader.service';

describe('Service: LayoutLoader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutLoaderService]
    });
  });

  it('should ...', inject([LayoutLoaderService], (service: LayoutLoaderService) => {
    expect(service).toBeTruthy();
  }));
});

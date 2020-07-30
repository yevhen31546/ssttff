/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PhotoEssayService } from './photo-essay.service';

describe('Service: PhotoEssay', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotoEssayService]
    });
  });

  it('should ...', inject([PhotoEssayService], (service: PhotoEssayService) => {
    expect(service).toBeTruthy();
  }));
});

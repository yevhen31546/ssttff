/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SharePhotoEssayComponent } from './share-photo-essay.component';

describe('SharePhotoEssayComponent', () => {
  let component: SharePhotoEssayComponent;
  let fixture: ComponentFixture<SharePhotoEssayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePhotoEssayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePhotoEssayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

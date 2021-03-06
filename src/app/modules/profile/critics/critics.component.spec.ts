/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CriticsComponent } from './critics.component';

describe('CriticsComponent', () => {
  let component: CriticsComponent;
  let fixture: ComponentFixture<CriticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

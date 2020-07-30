import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StfModalComponent } from './stf-modal.component';

describe('StfModalComponent', () => {
  let component: StfModalComponent;
  let fixture: ComponentFixture<StfModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StfModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StfModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

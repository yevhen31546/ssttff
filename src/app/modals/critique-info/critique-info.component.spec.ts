/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { CritiqueInfoComponent } from './critique-info.component'

describe('CritiqueComponent', () => {
  let component: CritiqueInfoComponent
  let fixture: ComponentFixture<CritiqueInfoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CritiqueInfoComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CritiqueInfoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

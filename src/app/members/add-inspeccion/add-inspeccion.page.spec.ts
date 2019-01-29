import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInspeccionPage } from './add-inspeccion.page';

describe('AddInspeccionPage', () => {
  let component: AddInspeccionPage;
  let fixture: ComponentFixture<AddInspeccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInspeccionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInspeccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ASeleccionarInformePage } from './a-seleccionar-informe.page';

describe('ASeleccionarInformePage', () => {
  let component: ASeleccionarInformePage;
  let fixture: ComponentFixture<ASeleccionarInformePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ASeleccionarInformePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ASeleccionarInformePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarLicenciaPage } from './cargar-licencia.page';

describe('CargarLicenciaPage', () => {
  let component: CargarLicenciaPage;
  let fixture: ComponentFixture<CargarLicenciaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarLicenciaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarLicenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

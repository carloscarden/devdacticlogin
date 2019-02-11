import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarConvocatoriaPage } from './cargar-convocatoria.page';

describe('CargarConvocatoriaPage', () => {
  let component: CargarConvocatoriaPage;
  let fixture: ComponentFixture<CargarConvocatoriaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarConvocatoriaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarConvocatoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

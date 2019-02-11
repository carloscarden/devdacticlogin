import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarVisitaEscuelaPage } from './cargar-visita-escuela.page';

describe('CargarVisitaEscuelaPage', () => {
  let component: CargarVisitaEscuelaPage;
  let fixture: ComponentFixture<CargarVisitaEscuelaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarVisitaEscuelaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarVisitaEscuelaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

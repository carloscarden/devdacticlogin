import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarTrabajoAdministrativoPage } from './cargar-trabajo-administrativo.page';

describe('CargarTrabajoAdministrativoPage', () => {
  let component: CargarTrabajoAdministrativoPage;
  let fixture: ComponentFixture<CargarTrabajoAdministrativoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarTrabajoAdministrativoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarTrabajoAdministrativoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarVisitaEscuelaPage } from './listar-visita-escuela.page';

describe('ListarVisitaEscuelaPage', () => {
  let component: ListarVisitaEscuelaPage;
  let fixture: ComponentFixture<ListarVisitaEscuelaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarVisitaEscuelaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarVisitaEscuelaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

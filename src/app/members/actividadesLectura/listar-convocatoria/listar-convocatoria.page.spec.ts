import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarConvocatoriaPage } from './listar-convocatoria.page';

describe('ListarConvocatoriaPage', () => {
  let component: ListarConvocatoriaPage;
  let fixture: ComponentFixture<ListarConvocatoriaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarConvocatoriaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarConvocatoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

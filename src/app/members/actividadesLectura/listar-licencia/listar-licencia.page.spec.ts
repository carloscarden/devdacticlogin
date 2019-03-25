import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLicenciaPage } from './listar-licencia.page';

describe('ListarLicenciaPage', () => {
  let component: ListarLicenciaPage;
  let fixture: ComponentFixture<ListarLicenciaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarLicenciaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarLicenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

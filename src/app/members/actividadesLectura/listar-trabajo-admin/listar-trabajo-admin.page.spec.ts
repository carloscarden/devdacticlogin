import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTrabajoAdminPage } from './listar-trabajo-admin.page';

describe('ListarTrabajoAdminPage', () => {
  let component: ListarTrabajoAdminPage;
  let fixture: ComponentFixture<ListarTrabajoAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarTrabajoAdminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarTrabajoAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

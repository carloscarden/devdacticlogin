import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenciaDetailsPage } from './licencia-details.page';

describe('LicenciaDetailsPage', () => {
  let component: LicenciaDetailsPage;
  let fixture: ComponentFixture<LicenciaDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenciaDetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenciaDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

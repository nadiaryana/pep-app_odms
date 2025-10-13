import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeProductionAddComponent } from './pe-production-add.component';

describe('PeProductionAddComponent', () => {
  let component: PeProductionAddComponent;
  let fixture: ComponentFixture<PeProductionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeProductionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeProductionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

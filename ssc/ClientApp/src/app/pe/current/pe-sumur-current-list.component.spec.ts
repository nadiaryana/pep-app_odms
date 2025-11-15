import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeSumurCurrentListComponent } from './pe-sumur-current-list.component';

describe('PeSumurCurrentListComponent', () => {
  let component: PeSumurCurrentListComponent;
  let fixture: ComponentFixture<PeSumurCurrentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeSumurCurrentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeSumurCurrentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

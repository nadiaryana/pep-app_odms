import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SumurComponent } from './pe-sumur.component';

describe('SumurComponent', () => {
  let component: SumurComponent;
  let fixture: ComponentFixture<SumurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SumurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SumurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IprComponent } from './pe-ipr.component';

describe('IprComponent', () => {
  let component: IprComponent;
  let fixture: ComponentFixture<IprComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IprComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

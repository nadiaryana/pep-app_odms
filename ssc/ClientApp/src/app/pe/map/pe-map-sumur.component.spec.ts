import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSumurComponent } from './pe-map-sumur.component';

describe('MapSumurComponent', () => {
  let component: MapSumurComponent;
  let fixture: ComponentFixture<MapSumurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSumurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSumurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


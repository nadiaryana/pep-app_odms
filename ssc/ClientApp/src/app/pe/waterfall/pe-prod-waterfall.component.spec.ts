import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeProdWaterfallComponent} from './pe-prod-waterfall.component';

describe('PeProdWaterfallComponent', () => {
  let component: PeProdWaterfallComponent;
  let fixture: ComponentFixture<PeProdWaterfallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeProdWaterfallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeProdWaterfallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

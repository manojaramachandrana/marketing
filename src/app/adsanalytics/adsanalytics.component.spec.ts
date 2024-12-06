import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsanalyticsComponent } from './adsanalytics.component';

describe('AdsanalyticsComponent', () => {
  let component: AdsanalyticsComponent;
  let fixture: ComponentFixture<AdsanalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdsanalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsanalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

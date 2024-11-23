import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinaranalyticsComponent } from './webinaranalytics.component';

describe('WebinaranalyticsComponent', () => {
  let component: WebinaranalyticsComponent;
  let fixture: ComponentFixture<WebinaranalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebinaranalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinaranalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

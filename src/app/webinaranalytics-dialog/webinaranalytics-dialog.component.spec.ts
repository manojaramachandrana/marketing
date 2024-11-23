import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinaranalyticsDialogComponent } from './webinaranalytics-dialog.component';

describe('WebinaranalyticsDialogComponent', () => {
  let component: WebinaranalyticsDialogComponent;
  let fixture: ComponentFixture<WebinaranalyticsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebinaranalyticsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinaranalyticsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

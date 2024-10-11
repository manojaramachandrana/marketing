import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignanalyticsDialogComponent } from './campaignanalytics-dialog.component';

describe('CampaignanalyticsDialogComponent', () => {
  let component: CampaignanalyticsDialogComponent;
  let fixture: ComponentFixture<CampaignanalyticsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignanalyticsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignanalyticsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignanalyticsComponent } from './campaignanalytics.component';

describe('CampaignanalyticsComponent', () => {
  let component: CampaignanalyticsComponent;
  let fixture: ComponentFixture<CampaignanalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignanalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignanalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

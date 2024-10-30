import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdcampaignComponent } from './adcampaign.component';

describe('AdcampaignComponent', () => {
  let component: AdcampaignComponent;
  let fixture: ComponentFixture<AdcampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdcampaignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdcampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

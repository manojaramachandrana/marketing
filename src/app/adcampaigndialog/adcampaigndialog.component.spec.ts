import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdcampaigndialogComponent } from './adcampaigndialog.component';

describe('AdcampaigndialogComponent', () => {
  let component: AdcampaigndialogComponent;
  let fixture: ComponentFixture<AdcampaigndialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdcampaigndialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdcampaigndialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

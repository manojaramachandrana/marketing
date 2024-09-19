import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonalcamComponent } from './seasonalcam.component';

describe('SeasonalcamComponent', () => {
  let component: SeasonalcamComponent;
  let fixture: ComponentFixture<SeasonalcamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeasonalcamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonalcamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

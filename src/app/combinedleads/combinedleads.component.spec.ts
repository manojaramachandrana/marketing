import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedleadsComponent } from './combinedleads.component';

describe('CombinedleadsComponent', () => {
  let component: CombinedleadsComponent;
  let fixture: ComponentFixture<CombinedleadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinedleadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinedleadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

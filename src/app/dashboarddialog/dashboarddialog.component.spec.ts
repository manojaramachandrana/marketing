import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboarddialogComponent } from './dashboarddialog.component';

describe('DashboarddialogComponent', () => {
  let component: DashboarddialogComponent;
  let fixture: ComponentFixture<DashboarddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboarddialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboarddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

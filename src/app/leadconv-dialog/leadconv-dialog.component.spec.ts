import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadconvDialogComponent } from './leadconv-dialog.component';

describe('LeadconvDialogComponent', () => {
  let component: LeadconvDialogComponent;
  let fixture: ComponentFixture<LeadconvDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadconvDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadconvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

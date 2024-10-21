import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedDialogComponent } from './combined-dialog.component';

describe('CombinedDialogComponent', () => {
  let component: CombinedDialogComponent;
  let fixture: ComponentFixture<CombinedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

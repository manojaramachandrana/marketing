import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaddialogComponent } from './leaddialog.component';

describe('LeaddialogComponent', () => {
  let component: LeaddialogComponent;
  let fixture: ComponentFixture<LeaddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaddialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

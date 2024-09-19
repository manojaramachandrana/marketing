import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesdialogComponent } from './salesdialog.component';

describe('SalesdialogComponent', () => {
  let component: SalesdialogComponent;
  let fixture: ComponentFixture<SalesdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

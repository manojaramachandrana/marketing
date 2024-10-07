import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsconvComponent } from './leadsconv.component';

describe('LeadsconvComponent', () => {
  let component: LeadsconvComponent;
  let fixture: ComponentFixture<LeadsconvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsconvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsconvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

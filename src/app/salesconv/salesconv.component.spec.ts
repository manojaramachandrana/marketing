import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesconvComponent } from './salesconv.component';

describe('SalesconvComponent', () => {
  let component: SalesconvComponent;
  let fixture: ComponentFixture<SalesconvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesconvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesconvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

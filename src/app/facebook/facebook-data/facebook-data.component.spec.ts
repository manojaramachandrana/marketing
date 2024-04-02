import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookDataComponent } from './facebook-data.component';

describe('FacebookDataComponent', () => {
  let component: FacebookDataComponent;
  let fixture: ComponentFixture<FacebookDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

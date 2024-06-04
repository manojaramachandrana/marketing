import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NorthstarComponent } from './northstar.component';

describe('NorthstarComponent', () => {
  let component: NorthstarComponent;
  let fixture: ComponentFixture<NorthstarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NorthstarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NorthstarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

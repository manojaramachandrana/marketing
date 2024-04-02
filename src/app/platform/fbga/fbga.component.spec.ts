import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbgaComponent } from './fbga.component';

describe('FbgaComponent', () => {
  let component: FbgaComponent;
  let fixture: ComponentFixture<FbgaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FbgaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FbgaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

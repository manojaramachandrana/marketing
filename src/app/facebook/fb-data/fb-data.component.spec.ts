import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbDataComponent } from './fb-data.component';

describe('FbDataComponent', () => {
  let component: FbDataComponent;
  let fixture: ComponentFixture<FbDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FbDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FbDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

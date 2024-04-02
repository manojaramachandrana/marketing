import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbadsdataComponent } from './fbadsdata.component';

describe('FbadsdataComponent', () => {
  let component: FbadsdataComponent;
  let fixture: ComponentFixture<FbadsdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FbadsdataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FbadsdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

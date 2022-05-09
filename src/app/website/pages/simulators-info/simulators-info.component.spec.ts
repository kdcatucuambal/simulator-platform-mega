import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorsInfoComponent } from './simulators-info.component';

describe('SimulatorsInfoComponent', () => {
  let component: SimulatorsInfoComponent;
  let fixture: ComponentFixture<SimulatorsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulatorsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

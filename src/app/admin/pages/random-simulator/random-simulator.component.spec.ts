import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomSimulatorComponent } from './random-simulator.component';

describe('RandomSimulatorComponent', () => {
  let component: RandomSimulatorComponent;
  let fixture: ComponentFixture<RandomSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomSimulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

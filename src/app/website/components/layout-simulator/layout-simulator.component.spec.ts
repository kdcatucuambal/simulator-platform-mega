import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSimulatorComponent } from './layout-simulator.component';

describe('LayoutSimulatorComponent', () => {
  let component: LayoutSimulatorComponent;
  let fixture: ComponentFixture<LayoutSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutSimulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

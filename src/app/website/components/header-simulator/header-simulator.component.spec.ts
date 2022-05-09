import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSimulatorComponent } from './header-simulator.component';

describe('HeaderSimulatorComponent', () => {
  let component: HeaderSimulatorComponent;
  let fixture: ComponentFixture<HeaderSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderSimulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

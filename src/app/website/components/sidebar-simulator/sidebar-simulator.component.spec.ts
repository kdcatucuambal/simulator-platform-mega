import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSimulatorComponent } from './sidebar-simulator.component';

describe('SidebarSimulatorComponent', () => {
  let component: SidebarSimulatorComponent;
  let fixture: ComponentFixture<SidebarSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarSimulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

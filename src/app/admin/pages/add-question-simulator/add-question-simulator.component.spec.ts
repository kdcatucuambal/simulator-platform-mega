import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionSimulatorComponent } from './add-question-simulator.component';

describe('AddQuestionSimulatorComponent', () => {
  let component: AddQuestionSimulatorComponent;
  let fixture: ComponentFixture<AddQuestionSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQuestionSimulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuestionSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyAndPrivacyComponent } from './policy-and-privacy.component';

describe('PolicyAndPrivacyComponent', () => {
  let component: PolicyAndPrivacyComponent;
  let fixture: ComponentFixture<PolicyAndPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyAndPrivacyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyAndPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

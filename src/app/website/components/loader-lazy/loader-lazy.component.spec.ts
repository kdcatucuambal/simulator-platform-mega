import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderLazyComponent } from './loader-lazy.component';

describe('LoaderLazyComponent', () => {
  let component: LoaderLazyComponent;
  let fixture: ComponentFixture<LoaderLazyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderLazyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderLazyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

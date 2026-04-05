import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradingFormComponent } from './grading-form.component';

describe('GradingFormComponent', () => {
  let component: GradingFormComponent;
  let fixture: ComponentFixture<GradingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

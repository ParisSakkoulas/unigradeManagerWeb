import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingDetailComponent } from './teaching-detail.component';

describe('TeachingDetailComponent', () => {
  let component: TeachingDetailComponent;
  let fixture: ComponentFixture<TeachingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachingDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

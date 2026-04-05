import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingListComponent } from './teaching-list.component';

describe('TeachingListComponent', () => {
  let component: TeachingListComponent;
  let fixture: ComponentFixture<TeachingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

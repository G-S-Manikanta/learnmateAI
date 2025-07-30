import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyCompanionComponent } from './study-companion.component';

describe('StudyCompanionComponent', () => {
  let component: StudyCompanionComponent;
  let fixture: ComponentFixture<StudyCompanionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyCompanionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudyCompanionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UicCrudComponent } from './uic-crud.component';

describe('UicCrudComponent', () => {
  let component: UicCrudComponent;
  let fixture: ComponentFixture<UicCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UicCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UicCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

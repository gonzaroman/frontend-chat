import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivadosListComponent } from './privados-list.component';

describe('PrivadosListComponent', () => {
  let component: PrivadosListComponent;
  let fixture: ComponentFixture<PrivadosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivadosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivadosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariospageComponent } from './usuariospage.component';

describe('UsuariospageComponent', () => {
  let component: UsuariospageComponent;
  let fixture: ComponentFixture<UsuariospageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariospageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariospageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialisingGameComponent } from './initialising-game.component';

describe('InitialisingGameComponent', () => {
  let component: InitialisingGameComponent;
  let fixture: ComponentFixture<InitialisingGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialisingGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialisingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

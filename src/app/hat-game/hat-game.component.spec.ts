import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HatGameComponent } from './hat-game.component';

describe('HatGameComponent', () => {
  let component: HatGameComponent;
  let fixture: ComponentFixture<HatGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HatGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HatGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

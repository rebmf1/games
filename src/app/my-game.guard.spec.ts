import { TestBed } from '@angular/core/testing';

import { MyGameGuard } from './my-game.guard';

describe('MyGameGuard', () => {
  let guard: MyGameGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MyGameGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

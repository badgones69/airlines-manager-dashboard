import { Component } from '@angular/core';
import { MockUserService } from './mock-user-service';
import { MockAirlineService } from './mock-airline-service';

@Component({
  template: '<h1>Home</h1>',
})
export class MockHomeComponent {
  constructor(
    readonly userService: MockUserService = new MockUserService(),
    readonly airlineService: MockAirlineService = new MockAirlineService(),
  ) {}
}

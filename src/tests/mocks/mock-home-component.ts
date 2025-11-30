import { Component } from '@angular/core';
import { User } from '../../app/shared/models/User'
import { MockUserService } from './mock-user-service'
import { MockAirlineService } from './mock-airline-service'

@Component({})
export class MockHomeComponent {
    public authenticatedUser!: User;
    public welcomeMessage!: string;
    public welcomeLogo!: string;

    constructor(
        readonly userService: MockUserService = new MockUserService(),
        readonly airlineService: MockAirlineService = new MockAirlineService()
    ) {}
}
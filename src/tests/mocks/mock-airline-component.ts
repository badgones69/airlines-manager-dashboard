import { Component, Inject } from '@angular/core';
import { MockUserService } from './mock-user-service';
import { MockAirlineService } from './mock-airline-service';
import { MockNotificationService } from './mock-notification-service';
import { AirlineMapper } from '../../app/shared/mappers/AirlineMapper';
import { ToastrService } from 'ngx-toastr';
import { AirlineLogoComponent } from '../../app/airline/airline-logo/airline-logo.component';
import { ComponentType, NoopScrollStrategy } from '@angular/cdk/overlay';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({})
export class MockAirlineComponent {
    public airlineMapper: AirlineMapper = new AirlineMapper();

    constructor(
        readonly userService: MockUserService = new MockUserService(),
        readonly airlineService: MockAirlineService = new MockAirlineService(),
        readonly notificationService: MockNotificationService = new MockNotificationService(Inject(ToastrService)),
    ) {}

    changeLogo(): void {
      this.open(AirlineLogoComponent, {
        disableClose: false,
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy(),
      });
    }

    open(component: ComponentType<AirlineLogoComponent>, config: MatDialogConfig<any>): void {
      // MatDialog open() method overrinding
    }
}
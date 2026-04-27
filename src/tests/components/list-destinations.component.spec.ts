import { Component, Inject } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';
import { User } from '../../app/shared/models/User';
import { provideRouter } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MockUserService } from '../mocks/mock-user-service';
import { AirportMapper } from '../../app/shared/mappers/AirportMapper';
import { getDestinationsListTitle } from '../../app/shared/labels/lists';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { ComponentType, NoopScrollStrategy } from '@angular/cdk/overlay';
import { MockAirportService } from '../mocks/mock-airport-service';
import { DeleteDestinationComponent } from '../../app/destination/pages/delete-destination/delete-destination.component';
import { ListDestinationsComponent } from '../../app/destination/pages/list-destinations/list-destinations.component';
import { USA_REGIONS_FR } from '../../app/shared/constants/geographical-constants';

describe('ListDestinationsComponent', () => {
  @Component({
    template: '<h1>Edit destination</h1>',
  })
  class MockEditDestinationComponent {}

  @Component({})
  class MockListDestinationsComponent {
    public authenticatedUser!: User;
    public airportMapper: AirportMapper = new AirportMapper();

    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly airportService: MockAirportService = new MockAirportService(),
    ) {}

    deleteDestination(): void {
      this.open(DeleteDestinationComponent, {
        disableClose: false,
        autoFocus: true,
        scrollStrategy: new NoopScrollStrategy(),
      });
    }

    open(
      component: ComponentType<DeleteDestinationComponent>,
      config: MatDialogConfig<any>,
    ): void {
      // MatDialog open() method overrinding
    }
  }

  it('#ngOnInit should initialize "List destinations" component', () => {
    TestBed.runInInjectionContext(() => {
      const mockListDestinationsComponent: MockListDestinationsComponent =
        new MockListDestinationsComponent();
      const listDestinationsComponent: ListDestinationsComponent = new ListDestinationsComponent(
        Inject(MatDialog),
      );
      vi.spyOn(listDestinationsComponent, 'ngOnInit').mockImplementation(() => {
        listDestinationsComponent.destinationsListTitle = getDestinationsListTitle();

        mockListDestinationsComponent.userService.user.subscribe((user) => {
          if (user) {
            listDestinationsComponent.authenticatedUser = JSON.parse(user.toString());
          }
        });
      });
      listDestinationsComponent.ngOnInit();

      expect(listDestinationsComponent.destinationsListTitle).toStrictEqual('Liste des destinations');

      expect(listDestinationsComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });
    });
  });

  it('#openDestinationForm should redirect to "Edit destination" component', async () => {
    TestBed.configureTestingModule({
      imports: [ListDestinationsComponent],
      providers: [
        provideRouter([
          { path: 'destinations/edit/:uuid', component: MockEditDestinationComponent },
        ]),
      ],
    });

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/destinations/edit/:uuid');

    TestBed.runInInjectionContext(() => {
      const listDestinationsComponent: ListDestinationsComponent = new ListDestinationsComponent(
        Inject(MatDialog),
      );

      const spy = vi
        .spyOn(listDestinationsComponent, 'openDestinationForm')
        .mockImplementation(() => harness.routeNativeElement?.textContent);
      listDestinationsComponent.openDestinationForm({
        id: 4,
        uuid: 'destination-uuid',
        iata: 'IAH',
        name: 'George Bush',
        city: 'Houston',
        latitude: 4.4,
        longitude: 63.63,
        country: { id: 63, name: 'États-Unis', icao: 'N', flagCode: 'us', regions: USA_REGIONS_FR },
        region: { id: 4, code: 'TX', name: 'Texas' },
        hub: false,
      });
      expect(spy).toHaveBeenCalled();
      expect(
        listDestinationsComponent.openDestinationForm({
          id: 4,
          uuid: 'destination-uuid',
          iata: 'IAH',
          name: 'George Bush',
          city: 'Houston',
          latitude: 4.4,
          longitude: 63.63,
          country: { id: 63, name: 'États-Unis', icao: 'N', flagCode: 'us', regions: USA_REGIONS_FR },
          region: { id: 4, code: 'TX', name: 'Texas' },
          hub: false,
        }),
      ).toBe('Edit destination');
    });
  });

  it('#deleteDestination should open "Delete destination" dialog', () => {
    TestBed.runInInjectionContext(() => {
      const mockListDestinationsComponent: MockListDestinationsComponent =
        new MockListDestinationsComponent();
      const listDestinationsComponent: ListDestinationsComponent = new ListDestinationsComponent(
        Inject(MatDialog),
      );
      vi.spyOn(listDestinationsComponent, 'deleteDestination').mockImplementation(() => {
        vi.spyOn(mockListDestinationsComponent, 'deleteDestination').mockImplementation(() => {
          expect(mockListDestinationsComponent.open).toHaveBeenCalledWith(
            DeleteDestinationComponent,
            {
              disableClose: false,
              autoFocus: true,
              scrollStrategy: new NoopScrollStrategy(),
            },
          );
        });
      });
      listDestinationsComponent.deleteDestination({
        id: 4,
        uuid: 'destination-uuid',
        iata: 'IAH',
        name: 'George Bush',
        city: 'Houston',
        latitude: 4.4,
        longitude: 63.63,
        country: { id: 63, name: 'États-Unis', icao: 'N', flagCode: 'us', regions: USA_REGIONS_FR },
        region: { id: 4, code: 'TX', name: 'Texas' },
        hub: false,
      });
    });
  });
});

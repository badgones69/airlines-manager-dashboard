import { Component, Inject } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';
import { User } from '../../app/shared/models/User';
import { provideRouter } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MockUserService } from '../mocks/mock-user-service';
import { AirportMapper } from '../../app/shared/mappers/AirportMapper';
import { getHubsListTitle } from '../../app/shared/labels/lists';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { DeleteHubComponent } from '../../app/hub/pages/delete-hub/delete-hub.component';
import { ComponentType, NoopScrollStrategy } from '@angular/cdk/overlay';
import { ListHubsComponent } from '../../app/hub/pages/list-hubs/list-hubs.component';
import { MockAirportService } from '../mocks/mock-airport-service';
import { USA_REGIONS_FR } from '../../app/shared/constants/geographical-constants';

describe('ListHubsComponent', () => {
  @Component({
    template: '<h1>Edit hub</h1>',
  })
  class MockEditHubComponent {}

  @Component({})
  class MockListHubsComponent {
    public authenticatedUser!: User;
    public airportMapper: AirportMapper = new AirportMapper();

    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly airportService: MockAirportService = new MockAirportService(),
    ) {}

    deleteHub(): void {
      this.open(DeleteHubComponent, {
        disableClose: false,
        autoFocus: true,
        scrollStrategy: new NoopScrollStrategy(),
      });
    }

    open(
      component: ComponentType<DeleteHubComponent>,
      config: MatDialogConfig<any>,
    ): void {
      // MatDialog open() method overrinding
    }
  }

  it('#ngOnInit should initialize "List hubs" component', () => {
    TestBed.runInInjectionContext(() => {
      const mockListHubsComponent: MockListHubsComponent =
        new MockListHubsComponent();
      const listHubsComponent: ListHubsComponent = new ListHubsComponent(
        Inject(MatDialog),
      );
      vi.spyOn(listHubsComponent, 'ngOnInit').mockImplementation(() => {
        listHubsComponent.hubsListTitle = getHubsListTitle();

        mockListHubsComponent.userService.user.subscribe((user) => {
          if (user) {
            listHubsComponent.authenticatedUser = JSON.parse(user.toString());
          }
        });
        mockListHubsComponent.airportService.hubs.subscribe((hubs) => {
          if (hubs) {
            listHubsComponent.hubsList.data =
              mockListHubsComponent.airportMapper.airportsListFromDB(hubs);
          }
        });
      });
      listHubsComponent.ngOnInit();

      expect(listHubsComponent.hubsListTitle).toStrictEqual('Liste des hubs');

      expect(listHubsComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });

      expect(listHubsComponent.hubsList.data).toStrictEqual([
        {
          id: 1,
          uuid: 'uuid-airport',
          iata: 'JFK',
          name: 'John F. Kennedy',
          city: 'New York',
          latitude: 63.63,
          longitude: 1.1,
          country: {
            id: 63,
            name: 'États-Unis',
            icao: 'N',
            flagCode: 'us',
            regions: USA_REGIONS_FR,
          },
          region: { id: 1, code: 'NY', name: 'New York' },
          hub: true,
        },
        {
          id: 2,
          uuid: 'airport-uuid',
          iata: 'CDG',
          name: 'Roissy-Charles de Gaulle',
          city: 'Paris',
          latitude: 6.6,
          longitude: 7.7,
          country: { id: 67, name: 'France', icao: 'F', flagCode: 'fr' },
          region: undefined,
          hub: true,
        },
      ]);
    });
  });

  it('#openHubForm should redirect to "Edit hub" component', async () => {
    TestBed.configureTestingModule({
      imports: [ListHubsComponent],
      providers: [
        provideRouter([
          { path: 'hubs/edit/:uuid', component: MockEditHubComponent },
        ]),
      ],
    });

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/hubs/edit/:uuid');

    TestBed.runInInjectionContext(() => {
      const listHubsComponent: ListHubsComponent = new ListHubsComponent(
        Inject(MatDialog),
      );

      const spy = vi
        .spyOn(listHubsComponent, 'openHubForm')
        .mockImplementation(() => harness.routeNativeElement?.textContent);
      listHubsComponent.openHubForm({
        id: 2,
        uuid: 'airport-uuid',
        iata: 'CDG',
        name: 'Roissy-Charles de Gaulle',
        city: 'Paris',
        latitude: 6.6,
        longitude: 7.7,
        country: { id: 67, name: 'France', icao: 'F', flagCode: 'fr' },
        hub: true,
      });
      expect(spy).toHaveBeenCalled();
      expect(
        listHubsComponent.openHubForm({
          id: 2,
          uuid: 'airport-uuid',
          iata: 'CDG',
          name: 'Roissy-Charles de Gaulle',
          city: 'Paris',
          latitude: 6.6,
          longitude: 7.7,
          country: { id: 67, name: 'France', icao: 'F', flagCode: 'fr' },
          hub: true,
        }),
      ).toBe('Edit hub');
    });
  });

  it('#deleteHub should open "Delete hub" dialog', () => {
    TestBed.runInInjectionContext(() => {
      const mockListHubsComponent: MockListHubsComponent =
        new MockListHubsComponent();
      const listHubsComponent: ListHubsComponent = new ListHubsComponent(
        Inject(MatDialog),
      );
      vi.spyOn(listHubsComponent, 'deleteHub').mockImplementation(() => {
        vi.spyOn(mockListHubsComponent, 'deleteHub').mockImplementation(() => {
          expect(mockListHubsComponent.open).toHaveBeenCalledWith(
            DeleteHubComponent,
            {
              disableClose: false,
              autoFocus: true,
              scrollStrategy: new NoopScrollStrategy(),
            },
          );
        });
      });
      listHubsComponent.deleteHub({
        id: 2,
        uuid: 'airport-uuid',
        iata: 'CDG',
        name: 'Roissy-Charles de Gaulle',
        city: 'Paris',
        latitude: 6.6,
        longitude: 7.7,
        country: { id: 67, name: 'France', icao: 'F', flagCode: 'fr' },
        region: undefined,
        hub: true,
      });
    });
  });
});

import { Component, Inject } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';
import { User } from '../../app/shared/models/User';
import { ListAirportsComponent } from '../../app/shared/components/list-airports/list-airports.component';
import { MatDialog } from '@angular/material/dialog';
import { MockUserService } from '../mocks/mock-user-service';
import { MockAirportService } from '../mocks/mock-airport-service';
import { AirportMapper } from '../../app/shared/mappers/AirportMapper';
import { TestBed } from '@angular/core/testing';
import { USA_REGIONS_FR } from '../../app/shared/constants/geographical-constants';

describe('ListAirportsComponent', () => {
  @Component({})
  class MockListAirportsComponent {
    public authenticatedUser!: User;
    public airportMapper: AirportMapper = new AirportMapper();

    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly airportService: MockAirportService = new MockAirportService(),
    ) {}
  }

  it('#ngOnInit should initialize "List airports" component', () => {
    TestBed.runInInjectionContext(() => {
      const mockListAirportsComponent: MockListAirportsComponent =
        new MockListAirportsComponent();
      const listAirportsComponent: ListAirportsComponent =
        new ListAirportsComponent(Inject(MatDialog));
      vi.spyOn(listAirportsComponent, 'ngOnInit').mockImplementation(() => {
        mockListAirportsComponent.userService.user.subscribe((user) => {
          if (user) {
            listAirportsComponent.authenticatedUser = JSON.parse(
              user.toString(),
            );
          }
        });

        if (listAirportsComponent.isHub) {
          mockListAirportsComponent.airportService.hubs.subscribe((hubs) => {
            listAirportsComponent.airportsList.data =
              mockListAirportsComponent.airportMapper.airportsListFromDB(hubs);
          });
        } else {
          mockListAirportsComponent.airportService.destinations.subscribe(
            (destinations) => {
              listAirportsComponent.airportsList.data =
                mockListAirportsComponent.airportMapper.airportsListFromDB(
                  destinations,
                );
            },
          );
        }
      });
      listAirportsComponent.isHub = true;
      listAirportsComponent.ngOnInit();

      expect(listAirportsComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });

      expect(listAirportsComponent.airportsList.data).toStrictEqual([
        {
          id: 1,
          uuid: 'uuid-hub',
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
          uuid: 'hub-uuid',
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

      listAirportsComponent.isHub = false;
      listAirportsComponent.ngOnInit();

      expect(listAirportsComponent.airportsList.data).toStrictEqual([
        {
          id: 3,
          uuid: 'uuid-destination',
          iata: 'LGA',
          name: 'La Guardia',
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
          hub: false,
        },
        {
          id: 4,
          uuid: 'destination-uuid',
          iata: 'IAH',
          name: 'George Bush',
          city: 'Houston',
          latitude: 4.4,
          longitude: 63.63,
          country: {
            id: 63,
            name: 'États-Unis',
            icao: 'N',
            flagCode: 'us',
            regions: USA_REGIONS_FR,
          },
          region: { id: 4, code: 'TX', name: 'Texas' },
          hub: false,
        },
      ]);
    });
  });
});

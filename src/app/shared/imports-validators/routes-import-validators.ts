import { capitalize } from '../utils/labels-utils';
import { AirportService } from '../services/airport.service';
import { AirportMapper } from '../mappers/AirportMapper';
import { Airport } from '../dto/Airport';


function isValidDepartureHub(departureHub: any, arrivalAirport: any): boolean {
  return departureHub > 0 && arrivalAirport > 0 && departureHub !== arrivalAirport;
}

function isValidArrivalAirport(arrivalAirport: any, departureHub: any): boolean {
  return arrivalAirport > 0 && departureHub > 0 && arrivalAirport !== departureHub;
}

export async function isValidRoutesList(routesList: any[], airportService: AirportService): Promise<boolean> {
  const airportMapper: AirportMapper = new AirportMapper();
  const hubs: Airport[] = airportMapper.airportsListFromDB(await airportService.findAllHubs());
  const allDestinations: Airport[] = [...airportMapper.airportsListFromDB(await airportService.findAllDestinations()), ...hubs];

  routesList.forEach(route => {
    route.departureHub = hubs.find((airport: any) =>
      capitalize(airport.name) === capitalize(route.departureHub) ||
      capitalize(airport.iata) === capitalize(route.departureHub)
    )?.id ?? 0;

    route.arrivalAirport = allDestinations.find((airport: any) =>
      capitalize(airport.name) === capitalize(route.arrivalAirport) ||
      capitalize(airport.iata) === capitalize(route.arrivalAirport)
    )?.id ?? 0;
  });
  
  return routesList.length > 0 &&
    routesList.every(
      (route) =>
        isValidDepartureHub(route.departureHub, route.arrivalAirport) &&
        isValidArrivalAirport(route.arrivalAirport, route.departureHub),
    )
}

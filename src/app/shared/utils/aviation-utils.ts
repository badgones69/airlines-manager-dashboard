import { AUTHENTICATED_USER_STORAGE_NAME, EXISTING_FLIGHT_NUMBERS_STORAGE_NAME } from "../constants/storage-constants";
import { Flight } from "../dto/Flight";
import { Route } from "../dto/Route";
import { generateRandomNumber, generateRandomString } from "./commons-utils";
import { convertDateTimeInMinutes, getLanding, convertStringTimeInDate, hasSchedulesInconsistencies, hasSchedulesOverlap } from "./date-utils";
import { getStoredItem } from "./storage-utils";
import { getDepartureTimeFieldIdentifier, getLengthFieldIdentifier, getRouteFieldIdentifier } from "../labels/forms/aircraft-form";
import { Country } from "../dto/Country";
import { getAlphabet } from "../labels/commons/commons";
import { Manufacturer } from "../dto/Manufacturer";
import { MANUFACTURERS } from "../data/manufacturers";
import { capitalize } from "./labels-utils";
import { Model } from "../dto/Model";

export function getManufacturerById(manufacturerId: number): Manufacturer | undefined {
  return MANUFACTURERS.find((manufacturer) => manufacturer.id === manufacturerId);
}

export function getManufacturerByName(manufacturerName: string): Manufacturer | undefined {
  return MANUFACTURERS.find(
    (manufacturer) => capitalize(manufacturer.name) === capitalize(manufacturerName),
  );
}

export function getModelById(
  modelId: number,
  manufacturerId: number,
): Model | undefined {
  return getManufacturerById(manufacturerId)?.models?.find(
    (model) => model.id === modelId,
  );
}

export function getModelByName(
  modelName: string,
  manufacturerId: number,
): Model | undefined {
  return MANUFACTURERS
    .find((manufacturer) => manufacturer.id === manufacturerId)
    ?.models?.find(
      (model) => capitalize(model.name) === capitalize(modelName),
    );
}

export function generateAircraftRegistration(homeHubCountry: Country | undefined): string {
  if (homeHubCountry) {
    const registrationLength: number = homeHubCountry.id === 149 ? 6 : 5;
    let characters: string[] = [];
    let countryICAO: string = homeHubCountry.icao!.length > 1 ? generateRandomString(homeHubCountry.icao!, 1) : homeHubCountry.icao![0];

    switch (homeHubCountry.aircraftRegistrationRule) {
      case 'L':
        characters = getAlphabet();
        break;
      case 'D':
        characters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        break;
      case 'H':
        characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        break;
    }

    if (registrationLength > 1) {
      return `${countryICAO}-${generateRandomString(characters, registrationLength)}`;
    }
  }
  return '';
}

export function generateOutboundFlightNumber(): string {
  const authenticatedUser: any = JSON.parse(getStoredItem(AUTHENTICATED_USER_STORAGE_NAME).toString());

  const evenDigits: string[] = ['0', '2', '4', '6', '8'];
  const oddDigits: string[] = ['1', '3', '5', '7', '9'];
  const allDigits: string[] = evenDigits.concat(oddDigits);

  const flightNumberLength: number = generateRandomNumber(['1', '2', '3', '4', '5']);
  let flightNumber: string = '';

  if (flightNumberLength < 1) {
    return flightNumber;
  } else if (flightNumberLength === 1) {
    flightNumber = authenticatedUser.airline.icao
      .concat(generateRandomString(evenDigits.slice(1), 1));
  } else {
    flightNumber = authenticatedUser.airline.icao
      .concat(generateRandomString(allDigits.slice(1), 1))
      .concat(generateRandomString(allDigits, flightNumberLength - 2))
      .concat(generateRandomString(evenDigits, 1));
  }

  const flightNumbers: any = JSON.parse(getStoredItem(EXISTING_FLIGHT_NUMBERS_STORAGE_NAME).toString());

  if (flightNumbers?.includes(flightNumber)) {
    return generateOutboundFlightNumber();
  } else {
    return flightNumber;
  }
}

export function generateReturnFlightNumber(outboundFlightNumber: string): string {
  const outboundFlightNumberLastDigit: number = Number.parseInt(outboundFlightNumber!.at(-1)!);
  return outboundFlightNumber!.slice(0, -1).concat((outboundFlightNumberLastDigit + 1).toString());
}

export function validateAndFormatFlights(flightsFormValues: any, homeHubId: number, routes: Route[]): Flight[] {
  let flights: Flight[] = [];
  let flightsDurationsByDestination: Record<string, string[]> = {};

  flightsFormValues.forEach((flightFormValue: any, index: number) => {
    const flightLengthValue: string = flightFormValue[getLengthFieldIdentifier(index)];
    let takeOff: Date = convertStringTimeInDate(flightFormValue[getDepartureTimeFieldIdentifier(index)], false);
    let landing: Date = getLanding(takeOff, flightLengthValue);

    let flightDestination: any = flightFormValue[getRouteFieldIdentifier(index)];

    if (!flightsDurationsByDestination[flightDestination.iata]) {
      flightsDurationsByDestination[flightDestination.iata] = [];
    }
    if (!flightsDurationsByDestination[flightDestination.iata].includes(flightLengthValue)) {
      flightsDurationsByDestination[flightDestination.iata].push(flightLengthValue);
    }

    const route: Route = routes.find((route: any) => 
      route.arrivalAirport.iata === flightDestination.iata
      && route.departureHub.id === homeHubId
    )!;

    const flight = {
      number: generateOutboundFlightNumber(),
      route,
      takeOff,
      landing,
      return: false,
    } as Flight;
    flights.push(flight);

    if (hasSchedulesOverlap(flights) || hasSchedulesInconsistencies(flightsDurationsByDestination)) {
      return [];
    }
  });
  return splitOutboundReturnFlights(flights);
}

export function splitOutboundReturnFlights(flights: Flight[]): Flight[] {
  let flightsSplitted: Flight[] = [];

  flights.forEach((outboundFlight: Flight) => {
    let outboundFlightLanding: Date = new Date();
    outboundFlightLanding.setHours(outboundFlight.landing.getHours(), outboundFlight.landing.getMinutes(), 0);
    
    let returnFlightTakeOff: Date = new Date();
    let outboundFlightTakeOff: number = convertDateTimeInMinutes(outboundFlight.takeOff);
    let outboundFlightNewLanding: number = Math.trunc(((convertDateTimeInMinutes(outboundFlight.landing) - outboundFlightTakeOff) / 2));

    if (((convertDateTimeInMinutes(outboundFlight.landing) - outboundFlightTakeOff) % 2) == 1) {
      returnFlightTakeOff.setHours(0, outboundFlightTakeOff + outboundFlightNewLanding + 1, 0);
    } else {
      returnFlightTakeOff.setHours(0, outboundFlightTakeOff + outboundFlightNewLanding, 0);
    }

    const returnFlight = {
      number: `${generateReturnFlightNumber(outboundFlight.number)}`,
      route: outboundFlight.route,
      takeOff: returnFlightTakeOff,
      landing: outboundFlightLanding,
      return: true,
    } as Flight;
    outboundFlight.landing.setHours(0, outboundFlightTakeOff + outboundFlightNewLanding, 0);

    flightsSplitted.push(outboundFlight, returnFlight);
  });
  return flightsSplitted;
}

export function sortFlightsByTakeOffTime(flights: Flight[]): Flight[] {
  return flights.sort((f1, f2) => f1.takeOff.getTime() - f2.takeOff.getTime());
}
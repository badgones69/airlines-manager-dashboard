import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IDENTICAL_AIRPORTS_ERROR } from '../constants/forms-constants';
import { capitalize } from '../utils/labels-utils';
import { Airport } from '../dto/Airport';

export function identicalAirportsValidator(
  departureHubFieldIdentifier: string,
  arrivalAirportFieldIdentifier: string,
): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    let departureHubFieldValue!: string;
    let arrivalAirportFieldValue!: string;

    if (form.get(departureHubFieldIdentifier)?.value) {
      if (typeof form.get(departureHubFieldIdentifier)?.value === 'string') {
        departureHubFieldValue = capitalize(
          form.get(departureHubFieldIdentifier)?.value,
        );
      } else {
        departureHubFieldValue = capitalize(
          form.get(departureHubFieldIdentifier)?.value.iata,
        );
      }
    }

    if (form.get(arrivalAirportFieldIdentifier)?.value) {
      if (typeof form.get(arrivalAirportFieldIdentifier)?.value === 'string') {
        arrivalAirportFieldValue = capitalize(
          form.get(arrivalAirportFieldIdentifier)?.value,
        );
      } else {
        arrivalAirportFieldValue = capitalize(
          form.get(arrivalAirportFieldIdentifier)?.value.iata,
        );
      }
    }

    if (departureHubFieldValue === arrivalAirportFieldValue) {
      return { [IDENTICAL_AIRPORTS_ERROR]: true };
    }
    return null;
  };
}

export function compareAirportsNameAndIATA(
  departureHubFieldValue: any,
  arrivalAirportFieldValue: any,
  fieldValueChanged: Airport,
): boolean {
  let departureHub!: string;
  let arrivalAirport!: string;

  if (departureHubFieldValue) {
    if (typeof departureHubFieldValue === 'string') {
      departureHub = capitalize(departureHubFieldValue);
    } else {
      departureHub = capitalize(departureHubFieldValue.iata);
    }
  }

  if (arrivalAirportFieldValue) {
    if (typeof arrivalAirportFieldValue === 'string') {
      arrivalAirport = capitalize(arrivalAirportFieldValue);
    } else {
      arrivalAirport = capitalize(arrivalAirportFieldValue.iata);
    }
  }

  return (
    (departureHub === fieldValueChanged.iata ||
      departureHub === capitalize(fieldValueChanged.name)) &&
    (arrivalAirport === fieldValueChanged.iata ||
      arrivalAirport === capitalize(fieldValueChanged.name))
  );
}

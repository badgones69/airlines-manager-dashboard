import { IMPORT_DESTINATIONS, IMPORT_HUBS, IMPORT_USERS } from '../constants/forms-constants';
import { UserService } from '../services/user.service';

export function mapImportFileData(
  origin: string,
  importFileData: any[],
  userService: UserService,
): any[] {
  let mappedData: any[] = [];

  switch (origin) {
    case IMPORT_USERS:
      userService.user.subscribe((user) => {
        if (user) {
          let authenticatedUser: any = JSON.parse(user.toString());
          importFileData.forEach((line) => {
            let values: any[] = line.split(';');

            mappedData.push({
              givenName: values[0],
              surname: values[1],
              login: values[2],
              profile: Number(values[3]),
              airline: authenticatedUser.airline.id,
            });
          });
        }
      });
      break;
    case IMPORT_HUBS:
    case IMPORT_DESTINATIONS:
      importFileData.forEach(line => {
        let values: any[] = line.split(';');

        mappedData.push({
          iata: values[0],
          name: values[1],
          city: values[2],
          latitude: Number(values[3]),
          longitude: Number(values[4]),
          country: values[5],
          region: values[6],
          hub: origin === IMPORT_HUBS,
        });
      });
      break;
  }
  return mappedData;
}

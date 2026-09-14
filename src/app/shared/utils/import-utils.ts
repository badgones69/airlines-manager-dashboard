import { IMPORT_USERS } from "../constants/forms-constants";
import { UserService } from "../services/user.service";

export function mapImportFileData(origin: string, importFileData: any[], userService: UserService): any[] {
  let mappedData: any[] = [];

  switch (origin) {
    case IMPORT_USERS: 
      userService.user.subscribe((user) => {
        if (user) {
          let authenticatedUser: any = JSON.parse(user.toString());
          importFileData.forEach(line => {
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
  }
  return mappedData;
}
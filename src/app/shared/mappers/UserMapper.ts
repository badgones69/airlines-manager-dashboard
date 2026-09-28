import { User } from '../dto/User';
import { capitalizeWords } from '../utils/labels-utils';
import { AirlineMapper } from './AirlineMapper';

export class UserMapper {
  public airlineMapper: AirlineMapper = new AirlineMapper();

  /* DB => DTO mapping (users list) */
  public usersListFromDB(usersListFromDB: any[]): User[] {
    let usersList: User[] = [];

    for (const userFromDB of usersListFromDB) {
      usersList.push(this.userFromDB(userFromDB));
    }
    return usersList;
  }

  /* DB => DTO mapping */
  public userFromDB(userFromDB: any): User {
    return {
      id: userFromDB.userID,
      uuid: userFromDB.userUUID,
      givenName: userFromDB.userGivenName,
      surname: userFromDB.userSurname,
      login: userFromDB.userLogin,
      profile: userFromDB.userProfile,
      airline: this.airlineMapper.airlineFromDB(userFromDB.userAirline),
    } as User;
  }

  /* DTO => DB mapping */
  public userToDB(userToDB: any): any {
    return {
      userID: userToDB.id,
      userUUID: userToDB.uuid,
      userGivenName: capitalizeWords(userToDB.givenName),
      userSurname: capitalizeWords(userToDB.surname),
      userLogin: userToDB.login,
      userPassword: userToDB.password,
      userProfile: userToDB.profile,
      userAirline: userToDB.airline,
    };
  }
}

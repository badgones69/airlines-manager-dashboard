import { User } from '../models/User';
import { capitaliseFirstLetter } from '../utils/labels-utils';

export class UserMapper {

  /* DB => DTO mapping (users list) */
  public usersListFromDB(usersListFromDB: any[]): User[] {
    let usersList: User[] = [];

    usersListFromDB.forEach((userFromDB) => {
      usersList.push(this.userFromDB(userFromDB));
    });
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
    } as User;
  }

  /* DTO => DB mapping */
  public userToDB(userToDB: any): any {
    return {
      userID: userToDB.id,
      userUUID: userToDB.uuid,
      userGivenName: capitaliseFirstLetter(userToDB.givenName),
      userSurname: userToDB.surname.toUpperCase(),
      userLogin: userToDB.login,
      userPassword: userToDB.password,
      userProfile: userToDB.profile,
    };
  }
}

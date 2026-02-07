import { User } from '../models/User';
import {
  capitalizeDashedWordsFirstLetter,
  capitalizeFirstLetter,
  capitalizeSpaceSeparatedWordsFirstLetter,
  capitalize,
} from '../utils/labels-utils';

export class UserMapper {
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
    } as User;
  }

  /* DTO => DB mapping */
  public userToDB(userToDB: any): any {
    if (userToDB.givenName.includes('-') || userToDB.givenName.includes(' ')) {
      userToDB.givenName = capitalizeDashedWordsFirstLetter(
        capitalizeSpaceSeparatedWordsFirstLetter(userToDB.givenName),
      );
    } else {
      userToDB.givenName = capitalizeFirstLetter(userToDB.givenName);
    }

    return {
      userID: userToDB.id,
      userUUID: userToDB.uuid,
      userGivenName: userToDB.givenName,
      userSurname: capitalize(userToDB.surname),
      userLogin: userToDB.login,
      userPassword: userToDB.password,
      userProfile: userToDB.profile,
    };
  }
}

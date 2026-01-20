import { UserMapper } from '../../app/shared/mappers/UserMapper';
import { describe, it, expect } from 'vitest';
import { User } from '../../app/shared/models/User';

describe('UserMapper', () => {
  const userMapper: UserMapper = new UserMapper();

  it('#userFromDB should return mapped user from DB', () => {
    const userInDB: any = {
      userID: 3,
      userUUID: 'user-uuid',
      userGivenName: 'User-From',
      userSurname: 'DB',
      userLogin: 'user-from.db',
      userProfile: 3,
    };
    const userMappedFromDB: User = userMapper.userFromDB(userInDB);
    expect(userMappedFromDB.id).toStrictEqual(3);
    expect(userMappedFromDB.uuid).toStrictEqual('user-uuid');
    expect(userMappedFromDB.givenName).toStrictEqual('User-From');
    expect(userMappedFromDB.surname).toStrictEqual('DB');
    expect(userMappedFromDB.login).toStrictEqual('user-from.db');
    expect(userMappedFromDB.profile).toStrictEqual(3);
  });

  it('#usersListFromDB should return mapped users list from DB', () => {
    const usersInDB: any[] = [
      {
        userID: 2,
        userUUID: 'user-uuid',
        userGivenName: 'User-One',
        userSurname: 'FROM-DB',
        userLogin: 'user-one.from-db',
        userProfile: 2,
      },
      {
        userID: 22,
        userUUID: 'uuid-user',
        userGivenName: 'User-Two',
        userSurname: 'FROM-DB',
        userLogin: 'user-two.from-db',
        userProfile: 2,
      },
    ];
    const usersMappedFromDB: User[] = userMapper.usersListFromDB(usersInDB);
    expect(usersMappedFromDB.length).toStrictEqual(2);
    expect(usersMappedFromDB[0].id).toStrictEqual(2);
    expect(usersMappedFromDB[0].uuid).toStrictEqual('user-uuid');
    expect(usersMappedFromDB[0].givenName).toStrictEqual('User-One');
    expect(usersMappedFromDB[0].surname).toStrictEqual('FROM-DB');
    expect(usersMappedFromDB[0].login).toStrictEqual('user-one.from-db');
    expect(usersMappedFromDB[0].profile).toStrictEqual(2);
    expect(usersMappedFromDB[1].id).toStrictEqual(22);
    expect(usersMappedFromDB[1].uuid).toStrictEqual('uuid-user');
    expect(usersMappedFromDB[1].givenName).toStrictEqual('User-Two');
    expect(usersMappedFromDB[1].surname).toStrictEqual('FROM-DB');
    expect(usersMappedFromDB[1].login).toStrictEqual('user-two.from-db');
    expect(usersMappedFromDB[1].profile).toStrictEqual(2);
  });

  it('#userToDB should return mapped user to DB', () => {
    const user: User = {
      id: 1,
      uuid: 'uuid-user',
      givenName: 'john-jules w.',
      surname: 'smith',
      login: 'jj-w.s',
      profile: 1,
    };
    const userMappedToDB: any = userMapper.userToDB(user);
    expect(userMappedToDB.userID).toStrictEqual(1);
    expect(userMappedToDB.userUUID).toStrictEqual('uuid-user');
    expect(userMappedToDB.userGivenName).toStrictEqual('John-Jules W.');
    expect(userMappedToDB.userSurname).toStrictEqual('SMITH');
    expect(userMappedToDB.userLogin).toStrictEqual('jj-w.s');
    expect(userMappedToDB.userProfile).toStrictEqual(1);
  });
});

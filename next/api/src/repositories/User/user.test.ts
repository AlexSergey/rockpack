import { container } from '../../container';
import { UserModel } from '../../models/user';

import { UserRepositoryDIType } from './di.type';
import { IUserRepository } from './interface';

let userRepository;

beforeAll(() => {
  userRepository = container.get<IUserRepository>(UserRepositoryDIType);
});
afterAll(() => UserModel.sequelize.close());

describe('UserRepository tests', () => {
  test('Test method getUserByEmail', async () => {
    const admin = await userRepository.getUserByEmail('second_admin@rock.com');

    expect(admin.get('email')).toBe('second_admin@rock.com');
  });

  test('Test method getUserByEmail with userNotFoundError exception', async () => {
    const admin = await userRepository.getUserByEmail('second_admin2@rock.com');

    expect(admin).toBeNull();
  });

  test('Test method getUserById', async () => {
    const admin = await userRepository.getUserById(2);
    const user = await userRepository.getUserById(3);

    expect(admin.get('email')).toBe('second_admin@rock.com');
    expect(user.get('email')).toBe('simple_user@rock.com');
  });

  test('Test method getUserById with userNotFoundError exception', async () => {
    const user = await userRepository.getUserById(4);

    expect(user).toBeNull();
  });

  test('Test method getUsers', async () => {
    const users = await userRepository.getUsers();

    expect(users.length).toBe(3);
    expect(users[1].get('email')).toBe('second_admin@rock.com');
    expect(users[2].get('email')).toBe('simple_user@rock.com');
  });
});

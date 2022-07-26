import { container } from '../../container';
import { UserModel } from '../../models/user';
import { UserRepositoryDIType } from '../../repositories/user';
import type { IUserRepository } from '../../repositories/user';

import { UserServiceDIType } from './di.type';
import type { IUserService } from './interface';

let newuser;
let userRepository;
let userService;

beforeAll(() => {
  userRepository = container.get<IUserRepository>(UserRepositoryDIType);
  userService = container.get<IUserService>(UserServiceDIType);
});

afterAll(() => UserModel.sequelize.close());

describe('UserService tests', () => {
  test('signup', async () => {
    const { user, token } = await userService.signup('test_user@text.mail', '123456');
    newuser = user;

    expect(typeof token).toBe('string');
    expect(user.get('email')).toBe('test_user@text.mail');
  });

  test('signin', async () => {
    const { user, token } = await userService.signin('test_user@text.mail', '123456');

    expect(typeof token).toBe('string');
    expect(user.get('email')).toBe('test_user@text.mail');
  });

  test('destroy', async () => {
    const id = newuser.get('id');
    await userService.deleteUser(id);
    const u = await userRepository.getUserById(id);

    expect(u).toBeNull();
  });
});

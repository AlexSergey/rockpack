import type { UserRepositoryInterface } from '../../repositories/user';
import type { UserServiceInterface } from './interface';

import { container } from '../../container';
import { UserModel } from '../../models/user';
import { UserRepositoryDIType } from '../../repositories/user';
import { UserServiceDIType } from './di.type';

let newuser;
let userRepository;
let userService;

beforeAll(() => {
  userRepository = container.get<UserRepositoryInterface>(UserRepositoryDIType);
  userService = container.get<UserServiceInterface>(UserServiceDIType);
});

afterAll(() => UserModel.sequelize.close());

const testuser = 'test_user@text.mail';

describe('UserService tests', () => {
  test('signup', async () => {
    const { token, user } = await userService.signup(testuser, '123456');
    newuser = user;

    expect(typeof token).toBe('string');
    expect(user.get('email')).toBe(testuser);
  });

  test('signin', async () => {
    const { token, user } = await userService.signin(testuser, '123456');

    expect(typeof token).toBe('string');
    expect(user.get('email')).toBe(testuser);
  });

  test('destroy', async () => {
    const id = newuser.get('id');
    await userService.deleteUser(id);
    const u = await userRepository.getUserById(id);

    expect(u).toBeNull();
  });
});

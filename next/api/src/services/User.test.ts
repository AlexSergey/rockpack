import { UserService } from './User';
import { UserRepository } from '../repositories/User';

let newuser;

describe('UserService tests', () => {
  test('signup', async () => {
    const { user, token } = await UserService.signup('test_user@text.mail', '123456');
    newuser = user;

    expect(typeof token)
      .toBe('string');
    expect(user.get('email'))
      .toBe('test_user@text.mail');
  });

  test('signin', async () => {
    const { user, token } = await UserService.signin('test_user@text.mail', '123456');

    expect(typeof token)
      .toBe('string');
    expect(user.get('email'))
      .toBe('test_user@text.mail');
  });

  test('destroy', async () => {
    const id = newuser.get('id');
    await UserService.deleteUser(id);
    const u = await UserRepository.getUserById(id);

    expect(u)
      .toBeNull();
  });
});

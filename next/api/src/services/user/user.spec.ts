import { container } from '../../container';
import { UserModel } from '../../models/user';

let newuser;
let userRepository;
let userService;

beforeAll(() => {
  userRepository = container.getUserRepository();
  userService = container.getUserService();
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

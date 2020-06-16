import { UserRepository } from './User';

describe('UserRepository tests', () => {
  it('Test method getUserByEmail', async () => {
    const admin = await UserRepository.getUserByEmail('second_admin@rock.com');

    expect(admin.get('email'))
      .toBe('second_admin@rock.com');
  });

  it('Test method getUserByEmail with userNotFound exception', async () => {
    const admin = await UserRepository.getUserByEmail('second_admin2@rock.com');

    expect(admin)
      .toBeNull();
  });

  it('Test method getUserById', async () => {
    const admin = await UserRepository.getUserById('2');
    const user = await UserRepository.getUserById('3');

    expect(admin.get('email'))
      .toBe('second_admin@rock.com');
    expect(user.get('email'))
      .toBe('simple_user@rock.com');
  });

  it('Test method getUserById with userNotFound exception', async () => {
    const user = await UserRepository.getUserById('4');

    expect(user)
      .toBeNull();
  });

  it('Test method getUsers', async () => {
    const users = await UserRepository.getUsers();

    expect(users.length)
      .toBe(3);
    expect(users[1].get('email'))
      .toBe('second_admin@rock.com');
    expect(users[2].get('email'))
      .toBe('simple_user@rock.com');
  });
});

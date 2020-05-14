import { userFactory } from '../models/User';
import { sequelize } from '../boundaries/database';

export class UserController {
  static createUser = async (ctx): Promise<void> => {
    try {
      const User = userFactory(sequelize);

      await User.findOne({
        limit: 1,
        where: {
          username: 'dsfsdf2'
        } });
      //console.log(u);

      /*const user = await User.create({
        username: 'dsfsdf2',
        password: '123'
      });
      const isV = await user.isValidPassword(user.password, '123');
      console.log(isV);*/
    } catch (e) {
      //console.log(e);
    }
    ctx.body = 'user created';
    //await user.save();
    /*const user = userModel(knex);
    try {
      console.log(await user);
      /!*await user.save({
        username: 'test'
      });*!/
    } catch (e) {
      console.log(e);
    }
    ctx.body = 'user created';*/
  };
}

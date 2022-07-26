import { Context } from 'koa';

import { UserModel } from '../models/user';

export interface IKoaContext extends Context {
  user: UserModel;
}

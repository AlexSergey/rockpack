import { Context } from 'koa';

import { UserModel } from '../models/user';

export interface KoaContext extends Context {
  user: UserModel;
}

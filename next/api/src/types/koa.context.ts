import { Context } from 'koa';
import { UserModel } from '../models/User';

export interface KoaContext extends Context {
  user: UserModel;
}

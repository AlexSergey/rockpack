// eslint-disable-next-line no-shadow
export enum Roles {
  admin = 'admin',
  unauthorized = 'unauthorized',
  user = 'user',
}

export interface IUserStatistic {
  comments: number;
  posts: number;
}

export interface IUser {
  email: string;
  id: number;
  Role: {
    role: Roles;
  };
  Statistic: IUserStatistic;
}

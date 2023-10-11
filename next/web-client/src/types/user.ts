// eslint-disable-next-line no-shadow
export enum Roles {
  admin = 'admin',
  unauthorized = 'unauthorized',
  user = 'user',
}

export type UserStatistic = {
  comments: number;
  posts: number;
};

export interface IUser {
  Role: {
    role: Roles;
  };
  Statistic: UserStatistic;
  email: string;
  id: number;
}

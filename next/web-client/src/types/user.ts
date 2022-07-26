// eslint-disable-next-line no-shadow
export enum Roles {
  unauthorized = 'unauthorized',
  user = 'user',
  admin = 'admin',
}

export type UserStatistic = {
  comments: number;
  posts: number;
};

export interface IUser {
  id: number;
  email: string;
  Role: {
    role: Roles;
  };
  Statistic: UserStatistic;
}

// eslint-disable-next-line no-shadow
export enum Roles {
  admin = 'admin',
  unauthorized = 'unauthorized',
  user = 'user',
}

export interface UserStatistic {
  comments: number;
  posts: number;
}

export interface User {
  email: string;
  id: number;
  Role: {
    role: Roles;
  };
  Statistic: UserStatistic;
}

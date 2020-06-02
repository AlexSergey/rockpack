export enum Roles {
  unauthorized = 'unauthorized',
  user = 'user',
  admin = 'admin'
}

export type UserStatistic = {
  comments: number;
  posts: number;
};

export interface User {
  id: number;
  email: string;
  Role: {
    role: Roles;
  };
  Statistic: UserStatistic;
}

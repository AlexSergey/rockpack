export enum Roles {
  admin = 'admin',
  unauthorized = 'unauthorized',
  user = 'user',
}

export interface User {
  email: string;
  id: number;
  Role: {
    role: Roles;
  };
  Statistic: UserStatistic;
}

export interface UserStatistic {
  comments: number;
  posts: number;
}

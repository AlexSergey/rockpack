import { Roles } from './AuthManager';

export interface User {
  id: number;
  email: string;
  Role: {
    role: Roles;
  };
  Statistic: {
    posts: number;
    comments: number;
  };
}

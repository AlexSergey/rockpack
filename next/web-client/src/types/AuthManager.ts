export enum Roles {
  unauthorized = 'unauthorized',
  user = 'user',
  admin = 'admin'
}

export interface User {
  email: string;
  password: string;
}

export interface UserFull {
  email: string;
  Role: {
    role: Roles;
  };
  Statistic: {
    posts: number;
    comments: number;
  };
}

export interface AuthInterface {
  signin: (props: User) => void;
  signup: (props: User) => void;
  signout: () => void;
}

export interface AuthState {
  email: string;
  role: Roles;
}

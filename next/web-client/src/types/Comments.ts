export interface UserStatistic {
  comments: number;
  posts: number;
}

export interface Role {
  role: string;
}

export interface User {
  id?: number;
  email: string;
  Statistic?: UserStatistic;
  Role: Role;
}

export interface Comment {
  updatedAt?: Date;
  createdAt?: Date;
  text: string;
  id: number;
  User: User;
}

export interface CommentsState {
  loading: boolean;
  error: boolean;
  data: Comment[];
}

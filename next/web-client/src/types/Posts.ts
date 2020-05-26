export interface Preview {
  uri: string;
  thumbnail: string;
}

export interface PostStatistic {
  comments: number;
}

export interface UserStatistic {
  comments: number;
  posts: number;
}

export interface Role {
  role: string;
}

export interface User {
  id: number;
  email: string;
  Statistic: UserStatistic;
  Role: Role;
}

export interface Post {
  updatedAt: Date;
  createdAt: Date;
  title: string;
  id: number;
  Image?: Preview;
  Statistic: PostStatistic;
  User: User;
}

export interface PostsState {
  loading: boolean;
  error: boolean;
  data: Post[];
}

import { User } from './user';

export interface Preview {
  thumbnail: string;
  uri: string;
}

export interface PostStatistic {
  comments: number;
}

export interface Post {
  createdAt: string;
  id: number;
  Preview?: Preview;
  Statistic: PostStatistic;
  title: string;
  updatedAt: string;
  User: User;
}

export interface PostsState {
  data: Post[];
  error: boolean;
  loading: boolean;
}

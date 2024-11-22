import { User } from './user';

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

export interface PostStatistic {
  comments: number;
}

export interface Preview {
  thumbnail: string;
  uri: string;
}

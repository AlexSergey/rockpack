import { User } from './User';

export interface Preview {
  uri: string;
  thumbnail: string;
}

export interface PostStatistic {
  comments: number;
}

export interface Post {
  updatedAt: string;
  createdAt: string;
  title: string;
  id: number;
  Preview?: Preview;
  Statistic: PostStatistic;
  User: User;
}

export interface PostsState {
  loading: boolean;
  error: boolean;
  data: Post[];
}

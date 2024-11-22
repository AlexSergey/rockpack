import { User } from './user';

export interface Photo {
  thumbnail: string;
  uri: string;
}

export interface Post {
  createdAt: string;
  id: number;
  Photos?: Photo[];
  Statistic: PostStatistic;
  text: string;
  title: string;
  updatedAt: string;
  User: User;
}

export interface PostState {
  data: Post;
  error: boolean;
  loading: boolean;
}

export interface PostStatistic {
  comments: number;
}

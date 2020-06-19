import { User } from './User';

export interface Photo {
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
  text: string;
  id: number;
  Photos?: Photo[];
  Statistic: PostStatistic;
  User: User;
}

export interface PostState {
  loading: boolean;
  error: boolean;
  data: Post;
}

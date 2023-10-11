import { IUser } from './user';

export interface IPreview {
  thumbnail: string;
  uri: string;
}

export interface IPostStatistic {
  comments: number;
}

export interface IPost {
  Preview?: IPreview;
  Statistic: IPostStatistic;
  User: IUser;
  createdAt: string;
  id: number;
  title: string;
  updatedAt: string;
}

export interface IPostsState {
  data: IPost[];
  error: boolean;
  loading: boolean;
}

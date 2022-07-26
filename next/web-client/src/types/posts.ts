import { IUser } from './user';

export interface IPreview {
  uri: string;
  thumbnail: string;
}

export interface IPostStatistic {
  comments: number;
}

export interface IPost {
  updatedAt: string;
  createdAt: string;
  title: string;
  id: number;
  Preview?: IPreview;
  Statistic: IPostStatistic;
  User: IUser;
}

export interface IPostsState {
  loading: boolean;
  error: boolean;
  data: IPost[];
}

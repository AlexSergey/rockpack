import { IUser } from './user';

export interface IPreview {
  thumbnail: string;
  uri: string;
}

export interface IPostStatistic {
  comments: number;
}

export interface IPost {
  createdAt: string;
  id: number;
  Preview?: IPreview;
  Statistic: IPostStatistic;
  title: string;
  updatedAt: string;
  User: IUser;
}

export interface IPostsState {
  data: IPost[];
  error: boolean;
  loading: boolean;
}

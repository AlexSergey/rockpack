import { IUser } from './user';

export interface IPhoto {
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
  text: string;
  id: number;
  Photos?: IPhoto[];
  Statistic: IPostStatistic;
  User: IUser;
}

export interface IPostState {
  loading: boolean;
  error: boolean;
  data: IPost;
}

import { IUser } from './user';

export interface IPhoto {
  thumbnail: string;
  uri: string;
}

export interface IPostStatistic {
  comments: number;
}

export interface IPost {
  createdAt: string;
  id: number;
  Photos?: IPhoto[];
  Statistic: IPostStatistic;
  text: string;
  title: string;
  updatedAt: string;
  User: IUser;
}

export interface IPostState {
  data: IPost;
  error: boolean;
  loading: boolean;
}

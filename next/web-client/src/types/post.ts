import { IUser } from './user';

export interface IPhoto {
  thumbnail: string;
  uri: string;
}

export interface IPostStatistic {
  comments: number;
}

export interface IPost {
  Photos?: IPhoto[];
  Statistic: IPostStatistic;
  User: IUser;
  createdAt: string;
  id: number;
  text: string;
  title: string;
  updatedAt: string;
}

export interface IPostState {
  data: IPost;
  error: boolean;
  loading: boolean;
}

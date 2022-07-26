import { IUser } from './user';

export interface IComment {
  createdAt: string;
  text: string;
  id: number;
  User: IUser;
}

export interface ICommentsState {
  loading: boolean;
  error: boolean;
  data: IComment[];
}

import { IUser } from './user';

export interface IComment {
  User: IUser;
  createdAt: string;
  id: number;
  text: string;
}

export interface ICommentsState {
  data: IComment[];
  error: boolean;
  loading: boolean;
}

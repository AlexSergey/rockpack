import { IUser } from './user';

export interface IComment {
  createdAt: string;
  id: number;
  text: string;
  User: IUser;
}

export interface ICommentsState {
  data: IComment[];
  error: boolean;
  loading: boolean;
}

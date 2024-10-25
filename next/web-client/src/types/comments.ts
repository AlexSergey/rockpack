import { User } from './user';

export interface Comment {
  createdAt: string;
  id: number;
  text: string;
  User: User;
}

export interface CommentsState {
  data: Comment[];
  error: boolean;
  loading: boolean;
}

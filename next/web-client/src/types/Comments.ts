import { User } from './User';

export interface Comment {
  createdAt: Date;
  text: string;
  id: number;
  User: User;
}

export interface CommentsState {
  loading: boolean;
  error: boolean;
  data: Comment[];
}

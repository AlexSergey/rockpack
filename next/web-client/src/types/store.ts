import { Logger } from '@rockpack/logger';
import { History } from 'history';
import { RouterState } from 'connected-react-router';
import { Localization } from './Localization';
import { PostsState } from './Posts';
import { PostState } from './Post';
import { User } from './User';
import { UsersState } from './Users';
import { CommentsState } from './Comments';


export interface StoreProps {
  initState: {
    [key: string]: unknown;
  };
  logger: Logger;
  history: History;
  getToken: () => string | undefined;
}

export interface RootState {
  router: RouterState;
  user: User;
  localization: Localization;
  posts: PostsState;
  comments: CommentsState;
  post: PostState;
  users: UsersState;
}

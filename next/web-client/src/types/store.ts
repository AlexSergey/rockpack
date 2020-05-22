import { Logger } from '@rockpack/logger';
import { LocalizationState } from '../localization/types';
import { PostsState } from '../App/routes/Index/features/Posts/types';

export interface StoreProps {
  initState: {
    [key: string]: unknown;
  };
  logger: Logger;
}

export interface RootState {
  localization: LocalizationState;
  posts: PostsState;
}

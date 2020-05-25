import { Logger } from '@rockpack/logger';
import { LocalizationState } from '../features/Localization/types';
import { PostsState } from '../features/Posts/types';

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

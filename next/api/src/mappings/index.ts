import { commentMapping } from './Comment';
import { postMapping } from './Post';
import { userMapping } from './User';

export const installMappings = (): void => {
  commentMapping();
  postMapping();
  userMapping();
};

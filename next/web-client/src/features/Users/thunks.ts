import { setUsers, userDeleted } from './actions';
import { ThunkResult } from '../../types/thunk';

export const fetchUsers = (): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    const { data: { users } } = await services.users.fetchUsers();

    dispatch(setUsers({
      users
    }));
  } catch (error) {
    logger.error(error, false);
  }
};

export const deleteUser = (userId: number): ThunkResult => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    await services.users.deleteUser(userId);

    dispatch(userDeleted(userId));
  } catch (error) {
    logger.error(error, false);
  }
};

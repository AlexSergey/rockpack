import { Action } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchUsers, setUsers, deleteUser, userDeleted } from './actions';
import config from '../../config';
import { User } from '../../types/Users';

function* fetchUsersHandler(logger, rest, { payload }: ReturnType<typeof fetchUsers>):
Generator<Action, void, {
  data: {
    users: User[];
  };
}> {
  try {
    const { data: { users } } = yield call(() => rest.get(`${config.api}/v1/users`));

    yield put(setUsers({
      users
    }));
  } catch (error) {
    logger.error(error);
  }
  payload.resolver();
}

function* deleteUserHandler(logger, rest, { payload: { id } }: ReturnType<typeof userDeleted>):
Generator<Action, void, void> {
  try {
    yield call(() => rest.delete(`${config.api}/v1/users/${id}`));

    yield put(userDeleted(id));
  } catch (error) {
    logger.error(error);
  }
}

function* usersSaga(logger, rest): IterableIterator<unknown> {
  yield takeLatest(fetchUsers.type, fetchUsersHandler, logger, rest);
}

function* deleteUserSaga(logger, rest): IterableIterator<unknown> {
  yield takeLatest(deleteUser.type, deleteUserHandler, logger, rest);
}

export { usersSaga, deleteUserSaga };

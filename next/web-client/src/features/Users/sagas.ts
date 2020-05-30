import fetch from 'node-fetch';
import { Action } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchUsers, setUsers } from './actions';
import config from '../../config';
import { User } from '../../types/Users';

function* fetchUsersHandler(logger, { payload }: ReturnType<typeof fetchUsers>):
Generator<Action, void, {
  data: {
    users: User[];
  };
}> {
  try {
    const { data: { users } } = yield call(() => fetch(`${config.api}/v1/users`, {
      headers: {
        Authorization: payload.token
      }
    })
      .then(res => res.json()));

    yield put(setUsers({
      users
    }));
  } catch (error) {
    logger.error(error);
  }
  payload.resolver();
}

function* usersSaga(logger): IterableIterator<unknown> {
  yield takeLatest(fetchUsers.type, fetchUsersHandler, logger);
}

export { usersSaga };

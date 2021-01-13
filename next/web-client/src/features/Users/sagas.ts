/* eslint-disable @typescript-eslint/explicit-function-return-type  */
import { LoggerInterface } from 'logrock';
import { call, getContext, put, takeLatest } from 'redux-saga/effects';
import { fetchUsers, setUsers, deleteUser, userDeleted } from './actions';

function* fetchUsersHandler(logger: LoggerInterface) {
  try {
    const services = yield getContext('services');
    const { data: { users } } = yield call(services.users.fetchUsers);

    yield put(setUsers({
      users
    }));
  } catch (error) {
    logger.error(error, false);
  }
}

function* deleteUserHandler(logger: LoggerInterface, { payload: { id } }: ReturnType<typeof userDeleted>) {
  try {
    const services = yield getContext('services');
    yield call(() => services.users.deleteUser(id));

    yield put(userDeleted({ id }));
  } catch (error) {
    logger.error(error, false);
  }
}

function* usersSaga(logger: LoggerInterface): IterableIterator<unknown> {
  yield takeLatest(fetchUsers.type, fetchUsersHandler, logger);
}

function* deleteUserSaga(logger: LoggerInterface): IterableIterator<unknown> {
  yield takeLatest(deleteUser.type, deleteUserHandler, logger);
}

export { usersSaga, deleteUserSaga };

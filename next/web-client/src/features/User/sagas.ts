import { call, put, takeEvery } from 'redux-saga/effects';
import { Action } from '@reduxjs/toolkit';
import { signin, signup, signout, setUser, clearUserState, authorization } from './actions';
import { User } from '../../types/User';
import config from '../../config';

function* signIn(logger, rest, { payload: { email, password } }: ReturnType<typeof signin>):
Generator<Action, void, { data: User }> {
  try {
    const { data } = yield call(() => (
      rest.post(`${config.api}/v1/users/signin`, { email, password })
    ));

    yield put(setUser(data));
  } catch (error) {
    logger.error(error);
  }
}

function* authorizationHandler(logger, rest, { payload: { resolver } }: ReturnType<typeof authorization>):
Generator<Action, void, { data: User }> {
  try {
    const { data } = yield call(() => (
      rest.get(`${config.api}/v1/users/authorization`)
    ));
    if (typeof data === 'object') {
      yield put(setUser(data));
    }
  } catch (error) {
    logger.error(error);
  }
  resolver();
}

function* signUp(logger, rest, { payload: { email, password } }: ReturnType<typeof signin>):
Generator<Action, void, { data: User }> {
  try {
    const { data } = yield call(() => (
      rest.post(`${config.api}/v1/users/signup`, { email, password })
    ));
    yield put(setUser(data));
  } catch (error) {
    logger.error(error);
  }
}

function* signOut(logger, rest):
Generator<Action, void, void> {
  try {
    yield call(() => rest.get(`${config.api}/v1/users/signout`));
    yield put(clearUserState());
  } catch (error) {
    logger.error(error);
  }
}

function* signInSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(signin.type, signIn, logger, rest);
}

function* signUpSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(signup.type, signUp, logger, rest);
}

function* signOutSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(signout.type, signOut, logger, rest);
}

function* authorizationSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(authorization.type, authorizationHandler, logger, rest);
}

export {
  signInSaga,
  signUpSaga,
  signOutSaga,
  authorizationSaga
};

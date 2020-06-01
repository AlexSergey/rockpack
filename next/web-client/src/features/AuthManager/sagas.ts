import { call, put, takeEvery } from 'redux-saga/effects';
import { Action } from '@reduxjs/toolkit';
import { signin, signup, signout, setUser, removeUser, authorization, authorize } from './actions';
import { setUserStatistic } from '../_common/actions';
import { UserFull } from '../../types/AuthManager';
import config from '../../config';

type Answer = { data: UserFull };

function* signIn(logger, rest, { payload: { email, password } }: ReturnType<typeof signin>):
Generator<Action, void, Answer> {
  try {
    const { data } = yield call(() => (
      rest.post(`${config.api}/v1/users/signin`, { email, password })
    ));

    yield put(setUserStatistic({
      comments: data.Statistic.comments,
      posts: data.Statistic.posts
    }));
    yield put(setUser({
      email: data.email,
      role: data.Role.role
    }));
  } catch (error) {
    logger.error(error);
  }
}

function* authorizationHandler(logger, rest, { payload: { resolver } }: ReturnType<typeof authorize>):
Generator<Action, void, any> {
  try {
    const { data } = yield call(() => (
      rest.get(`${config.api}/v1/users/authorization`)
    ));

    yield put(setUserStatistic({
      comments: data.Statistic.comments,
      posts: data.Statistic.posts
    }));

    yield put(setUser({
      email: data.email,
      role: data.Role.role
    }));
  } catch (error) {
    logger.error(error);
  }
  resolver();
}

function* signUp(logger, rest, { payload: { email, password } }: ReturnType<typeof signin>):
Generator<Action, void, Answer> {
  try {
    const { data } = yield call(() => (
      rest.post(`${config.api}/v1/users/signup`, { email, password })
    ));
    yield put(setUserStatistic({
      comments: 0,
      posts: 0
    }));
    yield put(setUser({
      email: data.email,
      role: data.Role.role
    }));
  } catch (error) {
    logger.error(error);
  }
}

function* signOut(logger, rest):
Generator<Action, void, Answer> {
  try {
    yield call(() => rest.get(`${config.api}/v1/users/signout`));
    yield put(removeUser());
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

import fetch from 'node-fetch';
import { call, put, takeEvery } from 'redux-saga/effects';
import { Action } from '@reduxjs/toolkit';
import { signin, signup, signout, setUser, removeUser, authorization, authorize } from './actions';
import { setUserStatistic } from '../_common/actions';
import { UserFull } from '../../types/AuthManager';
import config from '../../config';

type Answer = { data: UserFull };

function* signIn(logger, { payload: { email, password } }: ReturnType<typeof signin>):
Generator<Action, void, Answer> {
  try {
    const { data } = yield call(() => (
      fetch(`${config.api}/v1/users/signin`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
        .then(res => res.json())
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

function* authorizationHandler(logger, { payload: { token, resolver } }: ReturnType<typeof authorize>):
Generator<Action, void, any> {
  try {
    const { data } = yield call(() => (
      fetch(`${config.api}/v1/users/authorization`, {
        headers: {
          Authorization: token
        }
      })
        .then(res => res.json())
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

function* signUp(logger, { payload: { email, password } }: ReturnType<typeof signin>):
Generator<Action, void, Answer> {
  try {
    const { data } = yield call(() => (
      fetch(`${config.api}/v1/users/signup`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
        .then(res => res.json())
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

function* signOut(logger):
Generator<Action, void, Answer> {
  try {
    yield call(() => (
      fetch(`${config.api}/v1/users/signout`)
        .then(res => res.json())
    ));
    yield put(removeUser());
  } catch (error) {
    logger.error(error);
  }
}

function* signInSaga(logger): IterableIterator<unknown> {
  yield takeEvery(signin.type, signIn, logger);
}

function* signUpSaga(logger): IterableIterator<unknown> {
  yield takeEvery(signup.type, signUp, logger);
}

function* signOutSaga(logger): IterableIterator<unknown> {
  yield takeEvery(signout.type, signOut, logger);
}

function* authorizationSaga(logger): IterableIterator<unknown> {
  yield takeEvery(authorization.type, authorizationHandler, logger);
}

export {
  signInSaga,
  signUpSaga,
  signOutSaga,
  authorizationSaga
};

import fetch from 'node-fetch';
import { call, put, takeLatest } from 'redux-saga/effects';
import { Action } from '@reduxjs/toolkit';
import { signin, signup, signout, setUser, removeUser } from './actions';
import { AuthState } from '../../types/AuthManager';
import config from '../../config';

type Answer = { data: AuthState };

function* signIn(logger, { payload: { email, password } }: ReturnType<typeof signin>):
Generator<Action, void, Answer> {
  try {
    const { data } = yield call(() => (
      fetch(`${config.api}/v1/users/signin`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        // @ts-ignore
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
        .then(res => res.json())
    ));
    yield put(setUser(data));
  } catch (error) {
    logger.error(error);
  }
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
        // @ts-ignore
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
        .then(res => res.json())
    ));
    yield put(setUser(data));
  } catch (error) {
    logger.error(error);
  }
}

function* signOut(logger):
Generator<Action, void, Answer> {
  try {
    yield call(() => (
      fetch(`${config.api}/v1/users/signout`, {
        // @ts-ignore
        credentials: 'include',
      })
        .then(res => res.json())
    ));
    yield put(removeUser());
  } catch (error) {
    logger.error(error);
  }
}

function* signInSaga(logger): IterableIterator<unknown> {
  yield takeLatest(signin.type, signIn, logger);
}

function* signUpSaga(logger): IterableIterator<unknown> {
  yield takeLatest(signup.type, signUp, logger);
}

function* signOutSaga(logger): IterableIterator<unknown> {
  yield takeLatest(signout.type, signOut, logger);
}

export {
  signInSaga,
  signUpSaga,
  signOutSaga
};

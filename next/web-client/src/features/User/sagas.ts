/* eslint-disable @typescript-eslint/explicit-function-return-type  */
import { LoggerInterface } from 'logrock';
import { call, getContext, put, takeEvery } from 'redux-saga/effects';
import { signin, signup, signout, setUser, clearUserState, authorization } from './actions';

function* signIn(logger: LoggerInterface, { payload: { email, password } }: ReturnType<typeof signin>) {
  try {
    const services = yield getContext('services');
    const { data } = yield call(() => services.user.signIn({ email, password }));

    yield put(setUser(data));
  } catch (error) {
    logger.error(error, false);
  }
}

function* authorizationHandler(logger: LoggerInterface) {
  try {
    const services = yield getContext('services');
    const { data } = yield call(services.user.authorization);
    if (typeof data === 'object') {
      yield put(setUser(data));
    }
  } catch (error) {
    logger.error(error, false);
  }
}

function* signUp(logger: LoggerInterface, { payload: { email, password } }: ReturnType<typeof signin>) {
  try {
    const services = yield getContext('services');
    const { data } = yield call(() => services.user.signUp({ email, password }));
    yield put(setUser(data));
  } catch (error) {
    logger.error(error, false);
  }
}

function* signOut(logger: LoggerInterface) {
  try {
    const services = yield getContext('services');
    yield call(() => services.user.signOut());
    yield put(clearUserState());
  } catch (error) {
    logger.error(error, false);
  }
}

function* signInSaga(logger: LoggerInterface): IterableIterator<unknown> {
  yield takeEvery(signin.type, signIn, logger);
}

function* signUpSaga(logger: LoggerInterface): IterableIterator<unknown> {
  yield takeEvery(signup.type, signUp, logger);
}

function* signOutSaga(logger: LoggerInterface): IterableIterator<unknown> {
  yield takeEvery(signout.type, signOut, logger);
}

function* authorizationSaga(logger: LoggerInterface): IterableIterator<unknown> {
  yield takeEvery(authorization.type, authorizationHandler, logger);
}

export {
  signInSaga,
  signUpSaga,
  signOutSaga,
  authorizationSaga
};

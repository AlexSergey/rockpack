/* eslint-disable @typescript-eslint/explicit-function-return-type  */
import { call, getContext, put, takeEvery } from 'redux-saga/effects';
import { signin, signup, signout, setUser, clearUserState, authorization } from './actions';

function* signIn(logger, { payload: { email, password } }: ReturnType<typeof signin>) {
  try {
    const services = yield getContext('services');
    const { data } = yield call(() => services.user.signIn({ email, password }));

    yield put(setUser(data));
  } catch (error) {
    logger.error(error);
  }
}

function* authorizationHandler(logger, { payload: { resolver } }: ReturnType<typeof authorization>) {
  try {
    const services = yield getContext('services');
    const { data } = yield call(services.user.authorization);
    if (typeof data === 'object') {
      yield put(setUser(data));
    }
  } catch (error) {
    logger.error(error);
  }
  resolver();
}

function* signUp(logger, { payload: { email, password } }: ReturnType<typeof signin>) {
  try {
    const services = yield getContext('services');
    const { data } = yield call(() => services.user.signUp({ email, password }));
    yield put(setUser(data));
  } catch (error) {
    logger.error(error);
  }
}

function* signOut(logger) {
  try {
    const services = yield getContext('services');
    yield call(() => services.user.signOut());
    yield put(clearUserState());
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

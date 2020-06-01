import { Action } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { call, put, takeEvery } from 'redux-saga/effects';
import { LocaleData } from '@rockpack/localazer';
import { fetchLocale, setLocale } from './actions';
import { getDefaultLanguage } from './utils';

function* fetchLocaleHandler(logger, rest, { payload: language }: ReturnType<typeof fetchLocale>):
Generator<Action, void, LocaleData> {
  try {
    if (getDefaultLanguage() === language) {
      return;
    }
    const locale = yield call(() => rest.get(`/locales/${language}.json`));

    yield put(setLocale({
      locale, language
    }));
    yield put(push(`/${language}`));
  } catch (error) {
    logger.error('This is error', true);
  }
}

function* localeSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(fetchLocale, fetchLocaleHandler, logger, rest);
}

export { localeSaga };

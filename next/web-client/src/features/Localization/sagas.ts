import { Action } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { call, put, takeEvery } from 'redux-saga/effects';
import { LocaleData, getDefaultLocale } from '@rockpack/localazer';
import { fetchLocalization, setLocale } from './actions';
import { getDefaultLanguage } from './utils';

function* fetchLocalizationHandler(logger, rest, { payload: language }: ReturnType<typeof fetchLocalization>):
Generator<Action, void, LocaleData> {
  try {
    if (getDefaultLanguage() === language) {
      yield put(setLocale({
        locale: getDefaultLocale(getDefaultLanguage()),
        language: getDefaultLanguage()
      }));
      yield put(push(`/${language}`));
      return;
    }
    const locale = yield call(() => rest.get(`/locales/${language}.json`));

    yield put(setLocale({
      locale,
      language
    }));
    yield put(push(`/${language}`));
  } catch (error) {
    logger.error('This is error', true);
  }
}

function* localizationSaga(logger, rest): IterableIterator<unknown> {
  yield takeEvery(fetchLocalization, fetchLocalizationHandler, logger, rest);
}

export { localizationSaga };

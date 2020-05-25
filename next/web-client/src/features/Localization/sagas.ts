import fetch from 'node-fetch';
import { PayloadAction } from '@reduxjs/toolkit';
import { Logger } from '@rockpack/logger';
import { call, takeEvery } from 'redux-saga/effects';
import { LocaleData } from '@rockpack/localazer';
import { implementPromiseAction } from '@adobe/redux-saga-promise';
import { fetchLocale } from './actions';
import { getDefaultLanguage } from './utils';

interface Locale {
  data: LocaleData;
}

function* getLocale(
  logger: Logger,
  action: PayloadAction<string>
): IterableIterator<unknown> {
  yield call(implementPromiseAction, action, function* fetchLocaleSaga(): IterableIterator<unknown> {
    const language = action.payload;
    if (getDefaultLanguage() === language) {
      return;
    }
    try {
      const locale: Locale = yield call(() => fetch(`/locales/${language}.json`).then(r => r.json()));

      return ({
        locale, language
      });
    } catch (error) {
      logger.error('This is error', true);
      throw error;
    }
  });
}

function* localeSaga(logger): IterableIterator<unknown> {
  yield takeEvery(fetchLocale, getLocale, logger);
}

export { localeSaga };

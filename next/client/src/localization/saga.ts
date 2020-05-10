import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Logger } from '@rock/log';
import { call, takeEvery } from 'redux-saga/effects';
import { LocaleData } from '@rock/localazer';
import { implementPromiseAction } from '@adobe/redux-saga-promise';
import { fetchLocale } from './action';
import { getDefaultLanguage } from './utils';

interface Locale {
  data: LocaleData;
}

function* handleFetchLocale(
  rest: AxiosInstance,
  logger: Logger,
  action: PayloadAction<string>
): IterableIterator<unknown> {
  yield call(implementPromiseAction, action, function* fetchLocaleSaga(): IterableIterator<unknown> {
    const language = action.payload;
    if (getDefaultLanguage() === language) {
      return;
    }
    try {
      const { data }: Locale = yield call(() => rest.get(`/locales/${language}.json`));
      return ({
        locale: data, language
      });
    } catch (error) {
      logger.error('This is error', true);
      throw error;
    }
  });
}

function* watchFetchLocale(rest, logger): IterableIterator<unknown> {
  yield takeEvery(fetchLocale, handleFetchLocale, rest, logger);
}

export default watchFetchLocale;

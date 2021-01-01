/* eslint-disable @typescript-eslint/explicit-function-return-type  */
import { push } from 'connected-react-router';
import { call, getContext, put, takeEvery } from 'redux-saga/effects';
import { getDefaultLocale, LocaleData } from '@localazer/component';
import { fetchLocalization, setLocale } from './actions';
import { ServicesInterface } from '../../services';
import { getDefaultLanguage } from './utils';

function* fetchLocalizationHandler(logger, { payload: { language, languages } }: ReturnType<typeof fetchLocalization>) {
  try {
    if (languages[language]) {
      yield put(setLocale({
        locale: languages[language],
        language
      }));
      return;
    }

    if (getDefaultLanguage() === language) {
      yield put(setLocale({
        locale: getDefaultLocale(getDefaultLanguage()),
        language: getDefaultLanguage()
      }));
      yield put(push(`/${language}`));
      return;
    }

    const services: ServicesInterface = yield getContext('services');
    const locale: LocaleData = yield call(() => services.localization.fetchLocalization(language));

    yield put(setLocale({
      locale,
      language
    }));
    yield put(push(`/${language}`));
  } catch (error) {
    logger.error('This is error', true);
  }
}

function* localizationSaga(logger): IterableIterator<unknown> {
  yield takeEvery(fetchLocalization, fetchLocalizationHandler, logger);
}

export { localizationSaga };

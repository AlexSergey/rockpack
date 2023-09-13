import { getDefaultLocale, LocaleData } from '@localazer/component';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { ILanguageList, Languages } from '../../types/localization';
import { IThunkExtras } from '../../types/store';

import { setLocale } from './actions';
import { getDefaultLanguage } from './utils';

export const fetchLocalization = createAsyncThunk<
  void,
  { language: Languages; languages: ILanguageList },
  { extra: IThunkExtras }
>('localization/fetch', async ({ language, languages }, { dispatch, extra }): Promise<void> => {
  const { history, services, logger } = extra;
  try {
    if (languages[language]) {
      dispatch(
        setLocale({
          language,
          locale: languages[language],
        }),
      );
      history.push(`/${language}`);

      return;
    }

    if (getDefaultLanguage() === language) {
      dispatch(
        setLocale({
          language: getDefaultLanguage(),
          locale: getDefaultLocale(getDefaultLanguage()),
        }),
      );
      history.push(`/${language}`);

      return;
    }
    const locale: LocaleData = await services.localization.fetchLocalization(language);

    dispatch(
      setLocale({
        language,
        locale,
      }),
    );
    history.push(`/${language}`);
  } catch (error) {
    logger.error('Cant change the language', true);
  }
});

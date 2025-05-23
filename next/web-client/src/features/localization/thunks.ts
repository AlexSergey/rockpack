import { getDefaultLocale, LocaleData } from '@localazer/component';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { LanguageList, Languages } from '../../types/localization';
import { ThunkExtras } from '../../types/store';
import { setLocale } from './actions';
import { getDefaultLanguage } from './utils';

export const fetchLocalization = createAsyncThunk<
  void,
  { language: Languages; languages: LanguageList },
  { extra: ThunkExtras }
>('localization/fetch', async ({ language, languages }, { dispatch, extra }): Promise<void> => {
  const { history, logger, services } = extra;
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
    console.error(error);
    logger.error('Cant change the language', true);
  }
});

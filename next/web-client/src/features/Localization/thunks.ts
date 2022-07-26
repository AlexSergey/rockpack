import { getDefaultLocale, LocaleData } from '@localazer/component';

import { ILanguageList, Languages } from '../../types/localization';
import { ThunkResult } from '../../types/thunk';

import { setLocale } from './actions';
import { getDefaultLanguage } from './utils';

export type FetchLocalization = (args: { language: Languages; languages: ILanguageList }) => ThunkResult;

export const fetchLocalization: FetchLocalization =
  ({ language, languages }) =>
  async (dispatch, getState, { services, logger, history }) => {
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
  };

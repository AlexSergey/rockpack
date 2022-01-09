import { getDefaultLocale, LocaleData } from '@localazer/component';
import { setLocale } from './actions';
import { getDefaultLanguage } from './utils';
import { ThunkResult } from '../../types/thunk';
import { LanguageList, Languages } from '../../types/Localization';

export type FetchLocalization = (args: {
  language: Languages;
  languages: LanguageList
}) => ThunkResult;

export const fetchLocalization: FetchLocalization = ({
  language,
  languages
}) => async (
  dispatch,
  getState,
  { services, logger, history }
) => {
  try {
    if (languages[language]) {
      dispatch(setLocale({
        locale: languages[language],
        language
      }));
      history.push(`/${language}`);
      return;
    }

    if (getDefaultLanguage() === language) {
      dispatch(setLocale({
        locale: getDefaultLocale(getDefaultLanguage()),
        language: getDefaultLanguage()
      }));
      history.push(`/${language}`);
      return;
    }
    const locale: LocaleData = await services.localization.fetchLocalization(language);

    dispatch(setLocale({
      locale,
      language
    }));
    history.push(`/${language}`);
  } catch (error) {
    console.log(error);
    logger.error('Cant change the language', true);
  }
};

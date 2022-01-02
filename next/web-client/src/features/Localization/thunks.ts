import { getDefaultLocale, LocaleData } from '@localazer/component';
import { setLocale } from './actions';
import { getDefaultLanguage } from './utils';
import { ThunkResult } from '../../types/thunk';
import { LanguageList, Languages } from '../../types/Localization';

export type FetchLocalization = (args: {
  language: Languages;
  languages: LanguageList
}) => ThunkResult<boolean>;

export const fetchLocalization: FetchLocalization = ({
  language,
  languages
}) => async (
  dispatch,
  getState,
  { services, logger }
) => {
  try {
    if (languages[language]) {
      dispatch(setLocale({
        locale: languages[language],
        language
      }));
      return false;
    }

    if (getDefaultLanguage() === language) {
      dispatch(setLocale({
        locale: getDefaultLocale(getDefaultLanguage()),
        language: getDefaultLanguage()
      }));
      return true;
    }
    const locale: LocaleData = await services.localization.fetchLocalization(language);

    dispatch(setLocale({
      locale,
      language
    }));
    return true;
  } catch (error) {
    logger.error('Cant change the language', true);
  }
  return false;
};

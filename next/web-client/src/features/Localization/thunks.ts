import { getDefaultLocale, LocaleData } from '@localazer/component';
import { setLocale } from './actions';
import { getDefaultLanguage } from './utils';
import { ThunkResult } from '../../types/thunk';
import { LanguageList, Languages } from '../../types/Localization';

export const fetchLocalization = ({
  language,
  languages
} : {
  language: Languages;
  languages: LanguageList
}): ThunkResult => async (
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
    logger.error('Cant change the language', true);
  }
};

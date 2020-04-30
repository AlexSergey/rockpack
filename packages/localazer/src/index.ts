import LocalizationObserver, { LanguagesInterface, useI18n, LocalizationObserverContext } from './LocalizationObserver';
import Localization from './Localization';
import { l, nl, sprintf, I18N } from './jed';
import { detectBrowserLanguage, LocaleData, getDefault as getDefaultLocale } from './utils';

export {
  LocalizationObserver,
  LocalizationObserverContext,
  l,
  nl,
  sprintf,
  detectBrowserLanguage,
  LocaleData,
  LanguagesInterface,
  getDefaultLocale,
  useI18n,
  I18N
};

export default Localization;

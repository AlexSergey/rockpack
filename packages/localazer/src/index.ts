import Jed from 'jed';
import LocalizationObserver, { LanguagesInterface } from './LocalizationObserver';
import Localization from './Localization';
import { l, nl, sprintf, I18N } from './jed';
import { detectBrowserLanguage, LocaleData, getDefault as getDefaultLocale } from './utils';

export {
  LocalizationObserver,
  l,
  nl,
  sprintf,
  detectBrowserLanguage,
  LocaleData,
  LanguagesInterface,
  getDefaultLocale,
  Jed,
  I18N
};

export default Localization;

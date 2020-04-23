import LocalizationObserver, { LanguagesInterface } from './LocalizationObserver';
import Localization from './Localization';
import { l, nl, sprintf } from './jed';
import { detectBrowserLanguage, LocaleData } from './utils';
import jed from './i18n';

export { LocalizationObserver, l, nl, sprintf, jed, detectBrowserLanguage, LocaleData, LanguagesInterface };

export default Localization;

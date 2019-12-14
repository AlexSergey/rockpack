import LocalizationObserver from './LocalizationObserver';
import Localization from './Localization';
import { l, nl, sprintf } from './jed';
import { detectLanguage, parseLanguageFromUrl } from './utils';
import jed from './i18n';

export {
    LocalizationObserver,
    l,
    nl,
    sprintf,
    jed,
    detectLanguage,
    parseLanguageFromUrl
}

export default Localization;

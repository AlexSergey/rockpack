import urlParse from 'url-parse';
import { isArray, isObject } from 'valid-types';

const parseLanguageFromUrl = (url: string, languages: string[]): string | false => {
  const { pathname } = urlParse(url);

  if (pathname.indexOf('/') === 0) {
    let l = pathname.substr(1);

    if (l.indexOf('/') > 0) {
      l = l.split('/')[0];
    }

    if (isArray(languages) && languages.indexOf(l) >= 0) {
      return l;
    }
    if (isObject(languages)) {
      return Object.keys(languages)
        .indexOf(l) >= 0 ? l : false;
    }
  }

  return false;
};

export default parseLanguageFromUrl;

import React, { useState } from 'react';
import { detectBrowserLanguage, LocalizationObserver, LanguagesInterface } from '@rockpack/localazer';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { isObject, isString } from 'valid-types';
import parseLanguageFromUrl from '../utils/parseLanguageFromUrl';
import { Localization } from '../types';

const Wrapper = ({
  children
}: {
  children: JSX.Element;
  languages?: LanguagesInterface;
  active?: string;
}): JSX.Element => children;

interface LangWrapperInterface extends RouteComponentProps {
  activeLang?: string;
  localization?: Localization;
  children: (isLocalized?: boolean, languageState?: string, handler?: (lang: string) => void) => JSX.Element;
}

export const LangWrapper = withRouter((props: LangWrapperInterface) => {
  const isLocalized = isObject(props.localization);
  const LocalizationWrapper = isLocalized ? LocalizationObserver : Wrapper;

  let activeLanguage;

  if (isLocalized) {
    activeLanguage = parseLanguageFromUrl(document.location.pathname, Object.keys(props.localization));

    if (!activeLanguage && Object.keys(props.localization).length > 0) {
      const lang = detectBrowserLanguage();
      const langs = Array.isArray(lang) ? lang : [lang];
      const defaultLang = langs.map(e => (e.indexOf('-') ? e.split('-')[0] : e))[0];

      if (props.localization && props.localization[defaultLang]) {
        activeLanguage = defaultLang;
      } else if (props.localization) {
        activeLanguage = Object.keys(props.localization)[0];
      }
    }
  }

  if (!isString(activeLanguage)) {
    return (
      <Wrapper>
        {props.children()}
      </Wrapper>
    );
  }

  const [languageState, localization] = useState(activeLanguage);

  const languages = Object.keys(props.localization)
    .reduce((a, b) => {
      a[b] = props.localization[b].language ? props.localization[b].language : props.localization[b];
      return a;
    }, {});

  return (
    <LocalizationWrapper {...Object.assign({}, isLocalized ? {
      languages,
      currentLanguage: activeLanguage
    } : {})}
    >
      {props.children(isLocalized, languageState, (lang) => {
        const newUrl = isString(activeLanguage) ?
          document.location.pathname.replace(`/${activeLanguage}`, `/${lang}`) :
          false;

        if (typeof newUrl === 'string') {
          props.history.push(newUrl);
        }

        if (props.localization[lang]) {
          localization(lang);
        } else {
          // eslint-disable-next-line no-console
          console.warn(`Can't set language ${lang}. This language not available in localization config`);
        }
      })}
    </LocalizationWrapper>
  );
});

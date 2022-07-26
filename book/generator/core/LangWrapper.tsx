import { detectBrowserLanguage, LocalizationObserver, LanguagesInterface } from '@localazer/component';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isObject, isString } from 'valid-types';

import { Localization } from '../types';
import parseLanguageFromUrl from '../utils/parseLanguageFromUrl';

const Wrapper = ({
  children,
}: {
  children: JSX.Element;
  languages?: LanguagesInterface;
  active?: string;
}): JSX.Element => children;

interface LangWrapperInterface {
  activeLang?: string;
  localization?: Localization;
  children: (isLocalized?: boolean, languageState?: string, handler?: (lang: string) => void) => JSX.Element;
}

export const LangWrapper = (props: LangWrapperInterface): JSX.Element => {
  const navigate = useNavigate();
  const isLocalized = isObject(props.localization);
  const LocalizationWrapper = isLocalized ? LocalizationObserver : Wrapper;

  let activeLanguage;

  if (isLocalized) {
    activeLanguage = parseLanguageFromUrl(document.location.pathname, Object.keys(props.localization));

    if (!activeLanguage && Object.keys(props.localization).length > 0) {
      const lang = detectBrowserLanguage();
      const langs = Array.isArray(lang) ? lang : [lang];
      const defaultLang = langs.map((e) => (e.indexOf('-') ? e.split('-')[0] : e))[0];

      if (props.localization && props.localization[defaultLang]) {
        activeLanguage = defaultLang;
      } else if (props.localization) {
        activeLanguage = Object.keys(props.localization)[0];
      }
    }
  }

  if (!isString(activeLanguage)) {
    return <Wrapper>{props.children()}</Wrapper>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [languageState, localization] = useState(activeLanguage);

  const languages = Object.keys(props.localization).reduce((a, b) => {
    a[b] = props.localization[b].language ? props.localization[b].language : props.localization[b];

    return a;
  }, {});

  return (
    <LocalizationWrapper
      {...{
        ...(isLocalized
          ? {
              currentLanguage: activeLanguage,
              languages,
            }
          : {}),
      }}
    >
      {props.children(isLocalized, languageState, (lang) => {
        const newUrl = isString(activeLanguage)
          ? document.location.pathname.replace(`/${activeLanguage}`, `/${lang}`)
          : false;

        if (typeof newUrl === 'string') {
          navigate(newUrl);
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
};

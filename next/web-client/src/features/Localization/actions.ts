import { createAction } from '@reduxjs/toolkit';
import { LocaleData } from '@rockpack/localazer';
import { Languages, LanguageList } from '../../types/Localization';

export const fetchLocalization = createAction<{ language: Languages; languages: LanguageList }>('Fetching locale');

export const setLocale = createAction<{ locale: LocaleData; language: Languages }>('Set locale');

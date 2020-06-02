import { createAction } from '@reduxjs/toolkit';
import { LocaleData } from '@rockpack/localazer';
import { Languages } from '../../types/Localization';

export const fetchLocalization = createAction<Languages>('Fetching locale');

export const setLocale = createAction<{ locale: LocaleData; language: Languages }>('Set locale');

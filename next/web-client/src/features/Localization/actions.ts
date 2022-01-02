import { createAction } from '@reduxjs/toolkit';
import { LocaleData } from '@localazer/component';
import { Languages } from '../../types/Localization';

export type SetLocale = { locale: LocaleData; language: Languages };

export const setLocale = createAction<SetLocale>('Set locale');

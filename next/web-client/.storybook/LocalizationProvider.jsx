import React from 'react';
import { LocalizationObserver } from '@rockpack/localazer';

export const LocalizationProvider = (storyFn) => (
  <LocalizationObserver>
    {storyFn()}
  </LocalizationObserver>
)

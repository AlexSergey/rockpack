import React from 'react';
import { Switch as BaseSwitch } from 'react-router-dom';

import flattenChildren from 'react-flatten-children';

export const Switch = ({ children }: { children: JSX.Element | JSX.Element[]}): JSX.Element => (
  <BaseSwitch>{flattenChildren(children)}</BaseSwitch>
);

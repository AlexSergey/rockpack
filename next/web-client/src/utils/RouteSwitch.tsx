import React from 'react';
import { Routes } from 'react-router-dom';

import flattenChildren from 'react-flatten-children';

export const Switch = ({ children }: { children: JSX.Element | (JSX.Element | JSX.Element[])[] }): JSX.Element => (
  <Routes>{flattenChildren(children)}</Routes>
);

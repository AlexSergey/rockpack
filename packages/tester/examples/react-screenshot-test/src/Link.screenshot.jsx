import React from 'react';
import { ReactScreenshotTest } from 'react-screenshot-test';
import Link from './Link';

describe('screenshots', () => {
  ReactScreenshotTest.create('Link')
    .viewport('Desktop', {
      width: 1024,
      height: 768,
    })
    .viewport('iPhone X', {
      width: 375,
      height: 812,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      isLandscape: false,
    })
    .shoot('Simple link', <Link title={"Hello"} url={"/"} />)
    .run();
});

import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  // const { t, i18n } = useTranslation();

  //return <h1>{t('iam')}</h1>

  const { t, i18n } = useTranslation();

  return (
    <h1>{t('iam')}</h1>
  )
}

// i18n translations might still be loaded by the xhr backend
// use react's Suspense
export default function App() {
  return (
    <Suspense fallback={'loading'}>
      <MyComponent />
    </Suspense>
  );
}

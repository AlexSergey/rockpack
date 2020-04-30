import { createPromiseAction } from '@adobe/redux-saga-promise';

export const fetchLocale = createPromiseAction('Fetch locale from the server');

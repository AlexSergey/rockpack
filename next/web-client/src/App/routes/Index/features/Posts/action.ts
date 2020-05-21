import { createAction } from '@reduxjs/toolkit';

export const fetchDog = createAction('Posts will fetch');

export const requestDog = createAction('The dog is fetching...');

export const requestDogSuccess = createAction('The dog has already fetched');

export const requestDogError = createAction('The dog fetched with error');

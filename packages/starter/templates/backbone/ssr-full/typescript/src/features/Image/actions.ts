import { createAction } from '@reduxjs/toolkit';

export const fetchImage = createAction('The image will fetch');

export const requestImage = createAction('The image is fetching...');

export const requestImageSuccess = createAction('The image has already fetched');

export const requestImageError = createAction('The image fetched with error');

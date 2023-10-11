import fetch from 'node-fetch';

import { IImageService, imageService } from './features/image/service';

export interface IServices {
  image: IImageService;
}

export const createServices = (rest: typeof fetch): IServices => ({
  image: imageService(rest),
});

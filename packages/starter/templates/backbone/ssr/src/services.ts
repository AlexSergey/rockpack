import fetch from 'node-fetch';

import { imageService, IImageService } from './features/image/service';

export interface IServices {
  image: IImageService;
}

export const createServices = (rest: typeof fetch): IServices => ({
  image: imageService(rest),
});

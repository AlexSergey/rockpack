import { IImageService, imageService } from './features/image';

export interface IServices {
  image: IImageService;
}

export const createServices = (rest: typeof fetch): IServices => ({
  image: imageService(rest),
});

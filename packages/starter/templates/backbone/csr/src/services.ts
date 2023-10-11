import { IImageService, imageService } from './features/image/service';
import { IFetch } from './types/fetch';

export interface IServices {
  image: IImageService;
}

export const createServices = (rest: IFetch): IServices => ({
  image: imageService(rest),
});

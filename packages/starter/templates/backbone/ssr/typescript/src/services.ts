import { imageService, IImageService } from './features/image/service';

export interface IServices {
  image: IImageService;
}

export const createServices = (rest): IServices => ({
  image: imageService(rest),
});

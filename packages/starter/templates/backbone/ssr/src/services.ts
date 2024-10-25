import { ImageService, imageService } from './features/image';

export interface Services {
  image: ImageService;
}

export const createServices = (rest: typeof fetch): Services => ({
  image: imageService(rest),
});

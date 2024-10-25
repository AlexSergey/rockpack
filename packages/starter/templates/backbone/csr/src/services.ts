import { ImageService, imageService } from './features/image/service';
import { Fetch } from './types/fetch';

export interface Services {
  image: ImageService;
}

export const createServices = (rest: Fetch): Services => ({
  image: imageService(rest),
});

import { imageService } from './features/image';

export const createServices = (rest) => ({
  image: imageService(rest),
});

import { imageService, ImageServiceInterface } from './features/Image';

export interface ServicesInterface {
  image: ImageServiceInterface;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createServices = (rest): ServicesInterface => ({
  image: imageService(rest),
});

export default createServices;

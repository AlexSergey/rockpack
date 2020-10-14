import { imageService, ImageServiceInterface } from './features/Image';

export interface ServicesInterface {
  image: ImageServiceInterface;
}

const createServices = (rest): ServicesInterface => ({
  image: imageService(rest),
});

export default createServices;

import { imageService } from './features/Image';

const createServices = (rest) => ({
  image: imageService(rest),
});

export default createServices;

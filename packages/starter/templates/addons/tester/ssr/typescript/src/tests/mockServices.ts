import { ServicesInterface } from '../services';
import mockImageService from '../features/Image/service.mock';

const createMockServices = (): ServicesInterface => ({
  image: mockImageService(),
});

export default createMockServices;

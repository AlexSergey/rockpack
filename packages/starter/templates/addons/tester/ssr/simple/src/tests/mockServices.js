import mockImageService from '../features/Image/service.mock';

const createMockServices = () => ({
  image: mockImageService(),
});

export default createMockServices;

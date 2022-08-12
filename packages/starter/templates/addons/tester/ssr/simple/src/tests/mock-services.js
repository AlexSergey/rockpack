import { mockImageService } from '../features/image/service.mock';

export const createMockServices = () => ({
  image: mockImageService(),
});

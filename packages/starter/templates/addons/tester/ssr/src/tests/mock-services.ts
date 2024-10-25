import { mockImageService } from '../features/image/service.mock';
import { Services } from '../services';

export const createMockServices = (): Services => ({
  image: mockImageService(),
});

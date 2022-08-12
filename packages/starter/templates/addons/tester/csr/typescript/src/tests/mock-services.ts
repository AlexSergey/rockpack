import { mockImageService } from '../features/image/service.mock';
import { IServices } from '../services';

export const createMockServices = (): IServices => ({
  image: mockImageService(),
});

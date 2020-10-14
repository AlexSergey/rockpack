import { ImageServiceInterface, ImageRes } from './service';

const mockImageService = (): ImageServiceInterface => ({
  fetchImage: (): Promise<ImageRes> => (
    Promise.resolve({
      id: '0',
      author: 'Alejandro Escamilla',
      width: 5616,
      height: 3744,
      url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
      // eslint-disable-next-line @typescript-eslint/camelcase
      download_url: 'https://picsum.photos/id/0/5616/3744',
    })
  ),
});

export default mockImageService;

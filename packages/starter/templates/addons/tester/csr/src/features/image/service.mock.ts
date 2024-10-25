import { ImageRes, ImageService } from './service';

export const mockImageService = (): ImageService => ({
  fetchImage: (): Promise<ImageRes> =>
    Promise.resolve({
      author: 'Alejandro Escamilla',
      download_url: 'https://picsum.photos/id/0/5616/3744',

      height: 3744,
      id: '0',
      url: 'https://unsplash.com/photos/yC-Yzbqy7PY',

      width: 5616,
    }),
});

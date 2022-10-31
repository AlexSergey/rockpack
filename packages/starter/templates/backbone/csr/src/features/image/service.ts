import { IFetch } from '../../types/fetch';

export type ImageRes = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

export interface IImageService {
  fetchImage: () => Promise<ImageRes>;
}

export const imageService = (rest: IFetch): IImageService => ({
  fetchImage: async (): Promise<ImageRes> => {
    const response = await rest('https://picsum.photos/id/0/info');

    return await response.json();
  },
});

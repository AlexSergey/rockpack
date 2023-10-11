import { IFetch } from '../../types/fetch';

export type ImageRes = {
  author: string;
  download_url: string;
  height: number;
  id: string;
  url: string;
  width: number;
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

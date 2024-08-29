import { IFetch } from '../../types/fetch';

export interface IImageRes {
  author: string;
  download_url: string;
  height: number;
  id: string;
  url: string;
  width: number;
}

export interface IImageService {
  fetchImage: () => Promise<IImageRes>;
}

export const imageService = (rest: IFetch): IImageService => ({
  fetchImage: async (): Promise<IImageRes> => {
    const response = await rest('https://picsum.photos/id/0/info');

    return await response.json();
  },
});

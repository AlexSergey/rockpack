import { Fetch } from '../../types/fetch';

export interface ImageRes {
  author: string;
  download_url: string;
  height: number;
  id: string;
  url: string;
  width: number;
}

export interface ImageService {
  fetchImage: () => Promise<ImageRes>;
}

export const imageService = (rest: Fetch): ImageService => ({
  fetchImage: async (): Promise<ImageRes> => {
    const response = await rest('https://picsum.photos/id/0/info');

    return await response.json();
  },
});

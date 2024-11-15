import axios, { AxiosPromise } from 'axios';

export interface ImageService {
  fetchImage: () => AxiosPromise<ImageRes>;
}

export interface ImageRes {
  author: string;
  download_url: string;
  height: number;
  id: string;
  url: string;
  width: number;
}

export const imageService: ImageService = {
  fetchImage: (): AxiosPromise<ImageRes> => {
    return axios.get<ImageRes>('https://picsum.photos/id/0/info');
  },
};

export type ImageRes = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

export interface ImageServiceInterface {
  fetchImage: () => Promise<ImageRes>;
}

const imageService = (rest): ImageServiceInterface => ({
  fetchImage: async (): Promise<ImageRes> => {
    const response = await rest('https://picsum.photos/id/0/info');
    // eslint-disable-next-line no-return-await
    return await response.json();
  },
});

export default imageService;

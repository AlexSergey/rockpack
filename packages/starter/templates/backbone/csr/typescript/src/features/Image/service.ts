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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const imageService = (rest): ImageServiceInterface => ({
  fetchImage: async (): Promise<ImageRes> => {
    const response = await rest('https://picsum.photos/id/0/info');
    // eslint-disable-next-line no-return-await,@typescript-eslint/return-await
    return await response.json();
  },
});

export default imageService;

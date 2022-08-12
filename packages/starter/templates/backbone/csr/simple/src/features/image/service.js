export const imageService = (rest) => ({
  fetchImage: async () => {
    const response = await rest('https://picsum.photos/id/0/info');

    return await response.json();
  },
});

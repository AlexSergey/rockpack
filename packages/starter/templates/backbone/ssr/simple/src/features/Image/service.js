const imageService = (rest) => ({
  fetchImage: async () => {
    const response = await rest('https://picsum.photos/id/0/info');
    // eslint-disable-next-line no-return-await
    return await response.json();
  },
});

export default imageService;

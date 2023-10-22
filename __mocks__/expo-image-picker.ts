module.exports = {
  __esModule: true,
  launchImageLibraryAsync: jest.fn().mockReturnValue({
    canceled: false,
    assets: [
      {
        uri: 'file://test-uri',
      },
    ],
  }),
  MediaTypeOptions: {
    All: 'all',
    Videos: 'videos',
    Images: 'images',
  },
};

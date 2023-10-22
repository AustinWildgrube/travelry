module.exports = {
  __esModule: true,
  ...jest.requireActual('expo-router'),
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
};

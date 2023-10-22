module.exports = {
  ...jest.requireActual('@expo/react-native-action-sheet'),
  useActionSheet: () => ({
    showActionSheetWithOptions: jest.fn(),
  }),
};

module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@gluestack-ui/*|@gluestack-style/*|@gorhom/bottom-sheet/*|@react-native-community/*)',
  ],
  moduleNameMapper: {
    '^&/(.*)$': '<rootDir>/$1',
  },
};

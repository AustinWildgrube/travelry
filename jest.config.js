module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  setupFiles: ['./jestSetupFile.tsx'],
  roots: ['<rootDir>'],
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
        typeRoots: ['./src/types'],
      },
    },
  },
  moduleNameMapper: {
    '^@env(.*)$': '<rootDir>/.env$1',
    '^&(.*)$': '<rootDir>/src$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|expo-camera|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@tamagui)',
  ],
};

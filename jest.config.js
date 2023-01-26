module.exports = {
  testEnvironment: 'jsdom',
  preset: 'jest-expo',
  setupFiles: ['./jestSetupFile.js'],
  roots: ['<rootDir>'],
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
        typeRoots: ['./src/types'],
      },
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js',
  ],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/src$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base|tamagui|@tamagui)',
  ],
  coverageReporters: ['json-summary', 'text', 'lcov'],
};

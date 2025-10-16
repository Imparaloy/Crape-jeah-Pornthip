export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    '^tmpl$': '<rootDir>/tests/support/tmpl.js'
  },
  verbose: true
};

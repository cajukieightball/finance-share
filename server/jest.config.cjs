// server/jest.config.cjs
module.exports = {
  testEnvironment: 'node',

  // test files live
  roots: ['<rootDir>/routes', '<rootDir>/models'],

  transform: {},
};

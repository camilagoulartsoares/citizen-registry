const reporters = process.env.CI
  ? ['default', ['jest-junit', { outputDirectory: 'test-results', outputName: 'jest-junit.xml' }]]
  : ['default']

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
  ],
  reporters,
}

const path = require('node:path');

const rootFolder = path.resolve(__dirname, '..');

module.exports = {
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  projects: [`${rootFolder}/configs/jest.config.js`],
  reporters: [
    'default',
    [
      require.resolve('jest-html-reporters'),
      {
        expand: true,
        filename: 'jest_reporter.html',
        pageTitle: 'Tests Report',
        publicPath: './test-reports',
      },
    ],
  ],
};

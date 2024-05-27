export default {
  rootDir: './',
  bail: true,
  testMatch: ['<rootDir>/test/**/*.{spec,test}.{ts,tsx}'],
  transform: {
    '^.+.(tsx|ts|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleFileExtensions: ['tsx', 'ts', 'js', 'json', 'jsx'],
  collectCoverage: true,
  clearMocks: true,
  coverageDirectory: 'reports/coverage',
  coverageReporters: ['json-summary', 'text', 'lcov', 'html'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/@types/**/*'],
};

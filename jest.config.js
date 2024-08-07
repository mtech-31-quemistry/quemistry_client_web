module.exports = {
    "testMatch": [
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],testEnvironment: 'jest-environment-jsdom',
    collectCoverage: true,
    collectCoverageFrom: [
    "<rootDir>/app/**/*.{ts,tsx}"
  ],
    coverageDirectory: 'coverage',
    
  };
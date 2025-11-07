/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/ui/**/*.tsx', // Exclude shadcn UI components
    '!src/components/**/*.tsx', // Exclude React components (tested via integration)
    '!src/**/*.stories.tsx',
    '!src/elements/**/*.tsx', // Exclude element renderers (tested via integration)
    '!src/core/ElementRegistry.ts', // Tested via integration
    '!src/core/VisualEditor.tsx', // Tested via integration  
    '!src/lib/**/*.ts', // Utility file with simple re-exports
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 93,
      lines: 90,
      statements: 90,
    },
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};

"use strict";
/** @jest-config-loader ts-node */
/** @jest-config-loader-options {"transpileOnly": true} */
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    verbose: true,
    coverageDirectory: 'coverage',
    collectCoverage: true,
    testPathIgnorePatterns: ['/node_modules'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    testMatch: ['<rootDir>/src/**/test/*.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/test/*.ts?(x)', '!**/node_modules/**'],
    coverageThreshold: {
        global: {
            branches: 1,
            functions: 1,
            lines: 1,
            statements: 1
        }
    },
    moduleNameMapper: {
        '^@gateway/(.*)\\.js$': '<rootDir>/src/$1.ts',
        '^@gateway/(.*)$': ['<rootDir>/src/$1']
    }
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map
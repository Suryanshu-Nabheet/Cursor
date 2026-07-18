module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testPathIgnorePatterns: ['/node_modules/', '/.webpack/', '/out/'],
    transform: {
        // Compile TS tests without a full ts-jest install
        '^.+\\.tsx?$': '<rootDir>/jest.ts-transformer.js',
    },
}

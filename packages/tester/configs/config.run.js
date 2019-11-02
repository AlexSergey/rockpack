const { existsSync } = require('fs');
const path = require('path');

const rootFolder = path.resolve(__dirname, '..');

let currentProjectFolder = path.dirname(require.main.filename);

let tsConfig = path.resolve(__dirname, 'tsconfig.json');

if (existsSync(path.resolve(currentProjectFolder, './tsconfig.js'))) {
    tsConfig = path.resolve(currentProjectFolder, './tsconfig.js');
}

if (existsSync(path.resolve(currentProjectFolder, './tsconfig.json'))) {
    tsConfig = path.resolve(currentProjectFolder, './tsconfig.json');
}

module.exports = {
    transform: {
        "^.+\\.(ts|tsx)$": require.resolve('ts-jest'),
        "^.+\\.(js|jsx)$": `${rootFolder}/modules/babelJest.js`,
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `${rootFolder}/modules/fileTransformer.js`
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sss|styl)$": `${rootFolder}/modules/identityObjProxy.js`
    },
    transformIgnorePatterns: [
        "node_modules/"
    ],
    moduleFileExtensions: [
        "js", "jsx", "json", "ts", "tsx"
    ],
    testPathIgnorePatterns: [
        "<rootDir>/(build|dist|temp|docs|documentation|node_modules)/"
    ],
    setupFilesAfterEnv: [
        require.resolve('jest-extended'),
        require.resolve('expect-more-jest'),
        require.resolve('jest-generator'),
        require.resolve('jest-chain'),
        require.resolve('@testing-library/jest-dom/extend-expect')
    ],
    collectCoverage: true,
    coverageReporters: ["json", "html"],
    reporters: [
        'default',
        [require.resolve("jest-html-reporters"), {
            pageTitle: 'Tests Report',
            publicPath: "./test-reports",
            filename: "jest_reporter.html",
            expand: true
        }]
    ],
    globals: {
        'ts-jest': {
            tsConfig
        }
    }
};

const rootDir = process.cwd();

module.exports = {
  "verbose": true,
  "setupFiles": [
    `${rootDir}/tests/__mocks__/browserMocks.js`
  ],
  "moduleFileExtensions": [
    "js",
    "jsx"
  ],
  "moduleDirectories": [
    "node_modules"
  ],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `${rootDir}/src/tests/__mocks__/fileMock.js`,
    "^preact$": `${rootDir}/node_modules/preact/dist/preact.min.js`,
    "^react$": "preact-compat",
    "^react-dom$": "preact-compat",
    "^create-react-class$": "preact-compat/lib/create-react-class"
  }
}
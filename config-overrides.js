const path = require('path');
// const { override, addBabelPreset, addBabelPlugin } = require('customize-cra');

// // Function to override Jest configuration
// const jestConfig = function (config) {
//   config.transform = {
//     ...config.transform,
//     '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest for transpiling
//   };
//   config.transformIgnorePatterns = [
//     'node_modules/(?!(micromark.*|mdast.*|react-markdown|devlop|hast-util-to-jsx-runtime|comma-separated-tokens|estree-util-is-identifier-name|hast-util-whitespace|property-information|space-separated-tokens|unist-util-position|vfile-message|unist-util-stringify-position|html-url-attributes|remark-parse|mdast-util-from-markdown|mdast-util-to-string|micromark|decode-named-character-reference|character-entities|remark-rehype|trim-lines|unist-util-visit|unist-util-visit-parents|unist-util-is|another-module)/)', // Include react-markdown and any other modules that need transpiling
//   ];
//   config.moduleNameMapper = {
//     ...config.moduleNameMapper,
//     '\\.(css|jpg|png)$': '<rootDir>/path/to/__mocks__/fileMock.js',
//   };
//   // Enable TypeScript if using ts-jest
//   if (config.preset) {
//     config.preset = 'ts-jest';
//   }
//   return config;
// };

// Function to override Webpack configuration
const webpackConfig = function (config, env) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve.fallback,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      zlib: require.resolve('browserify-zlib'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      fs: false,
      net: false,
      tls: false,
    },
  };

  return config;
};

// Exporting both Jest and Webpack overrides
module.exports = {
  // Other overrides like webpack configuration can go here
  webpack: override(webpackConfig),
  // jest: jestConfig,
};

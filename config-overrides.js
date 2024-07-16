const path = require('path');

module.exports = function override(config, env) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve.fallback,
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "vm": require.resolve("vm-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "url": require.resolve("url/"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
      fs: false,
      net: false,
      tls: false
    }
  };

  return config;
};
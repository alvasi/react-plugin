const {composePlugins, withNx} = require('@nrwl/webpack')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  // add fallback for node modules
  config.resolve = {
    fallback: {
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
    }
  };

  config.plugins = [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      'process.env.REACT_APP_OPENAI_API_KEY': JSON.stringify(process.env.REACT_APP_OPENAI_API_KEY),
      'process.env.DEEPSEEK_API': JSON.stringify(process.env.DEEPSEEK_API)
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ];

  // add externals
  config.externals = {
    ...config.externals,
    solc: 'solc',
  };

  // add public path
  config.output.publicPath = './'

  // source-map loader
  config.module.rules.push({
    test: /\.js$/,
    use: ['source-map-loader'],
    enforce: 'pre',
  });

  config.ignoreWarnings = [/Failed to parse source map/] // ignore source-map-loader warnings

  // set minimizer
  config.optimization.minimizer = [
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 2015,
        compress: false,
        mangle: false,
        format: {
          comments: false,
        },
      },
      extractComments: false,
    }),
    new CssMinimizerPlugin(),
  ];

  config.watchOptions = {
    ignored: /node_modules/,
  };

  config.experiments.syncWebAssembly = true

  config.devServer = {
    headers: {
      'Permissions-Policy': 'clipboard-write=(self)'
    }
  };

  return config
});
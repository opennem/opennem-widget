const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const CopyPlugin = require('copy-webpack-plugin');

const timestamp = new Date().getTime();

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: false,
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new FixStyleOnlyEntriesPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/img/',
          to: 'img/[name].[ext]',
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  entry: {
    'opennem-widget-polyfills': './src/polyfills.js',
    'opennem-widget': './src/index.js',
    'opennem-widget-styles': './src/main.css',
  },
  output: {
    filename: `[name]-${timestamp}.bundle.js`,
    path: path.resolve(__dirname, 'dist'),
  },
};

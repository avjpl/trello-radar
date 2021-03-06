import Webpack           from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import OfflinePlugin     from 'offline-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import cssnext           from 'postcss-cssnext'
import nested            from 'postcss-nested'
import apply             from 'postcss-apply'

var cssLoaders = 'style!css?modules&localIdentName=[hash:base64]!postcss'

function extractForProduction (loaders) {
  return ExtractTextPlugin.extract('style', loaders.substr(loaders.indexOf('!')))
}

module.exports = {
  entry: [
    'sanitize.css/lib/sanitize.css',
    './src/index.jsx'
  ],

  debug: false,

  output: {
    path:       './dist',
    publicPath: '',
    filename:   'app.[hash].js'
  },

  module: {
    preLoaders: [],

    loaders: [
      {
        test:    /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel']
      },
      {
        test:   /\.p?css$/,
        loader: extractForProduction(cssLoaders)
      },
      {
        test:   /\.png$/,
        loader: 'url?limit=100000&mimetype=image/png'
      },
      {
        test:   /\.svg$/,
        loader: 'url?limit=100000&mimetype=image/svg+xml'
      },
      {
        test:   /\.gif$/,
        loader: 'url?limit=100000&mimetype=image/gif'
      },
      {
        test:   /\.jpg$/,
        loader: 'file'
      }
    ]
  },

  resolve: {
    modules:    ['src', 'node_modules'],
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    // Important to keep React file size down
    new Webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new Webpack.optimize.DedupePlugin(),
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('app.[hash].css'),
    new OfflinePlugin({
      scope:          '/',
      caches:         'all',
      updateStrategy: 'all',
      version:        'v1',
      ServiceWorker:  {output: 'sw.js'},
      AppCache:       false
    }),
    new HtmlWebpackPlugin({
      template:   './config/tmpl.html',
      production: true
    })
  ],

  postcss: function () {
    return [apply, cssnext, nested]
  }
}

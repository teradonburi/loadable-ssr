const path = require('path')
const nodeExternals = require('webpack-node-externals')
const LoadablePlugin = require('@loadable/webpack-plugin')
const loadableBabelPlugin = require('@loadable/babel-plugin')

const DIST_PATH = path.resolve(__dirname, 'public/dist')
const production = process.env.NODE_ENV === 'production'
const development =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const getConfig = target => {
  const web = target === 'web'
    
  return ({
    name: target,
    mode: development ? 'development' : 'production',
    target,
    entry: `./src/client/main-${target}.js`,
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react',
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: web ? 'entry' : undefined,
                    corejs: web ? 'core-js@3' : false,
                    targets: !web ? { node: 'current' } : undefined,
                    modules: false,
                  },
                ],
              ],
              plugins: ['@babel/plugin-syntax-dynamic-import', loadableBabelPlugin],
            },
          },
        },
      ],
    },
    externals: target === 'node' ? ['@loadable/component', nodeExternals()] : undefined,
    output: {
      path: path.join(DIST_PATH, target),
      filename: production ? '[name]-bundle-[chunkhash:8].js' : '[name].js',
      publicPath: `/dist/${target}/`,
      libraryTarget: target === 'node' ? 'commonjs2' : undefined,
    },
    plugins: [new LoadablePlugin()],
  })
}

module.exports = [getConfig('web'), getConfig('node')]

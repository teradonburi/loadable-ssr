
module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        corejs: false,
        targets: { node: 'current' },
        modules: 'commonjs',
      },
    ],
  ],
}



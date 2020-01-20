module.exports = {
  presets: [
    ['@babel/env', {
      targets: {
        browsers: ['last 2 versions', '> 0.25%']
      },
      useBuiltIns: 'usage',
      corejs: 3
    }],
    '@babel/react',
    '@babel/flow'
  ],
  plugins: [
    '@babel/syntax-dynamic-import',
    'dynamic-import-node'
  ]
}

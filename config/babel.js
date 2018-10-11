module.exports = {
  presets: [
    ['@babel/env', {
      'targets': {
        'browsers': ['last 2 versions', '> 1%']
      }
    }],
    '@babel/react',
    '@babel/flow'
  ],
  plugins: [
    '@babel/syntax-dynamic-import',
    'dynamic-import-node'
  ]
}

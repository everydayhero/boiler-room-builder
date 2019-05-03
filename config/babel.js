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
    '@babel/plugin-proposal-export-default-from',
    'dynamic-import-node'
  ]
}

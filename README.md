# Boiler Room Builder

A tool-chain for universal react apps

## Getting started

```
$ npm i boiler-room-builder@everydayhero/boiler-room-builder#v1.0.0-1
```

Add the scripts to your `package.json`

```
// ...
  "scripts": {
    "start": "brb serve",
    "build": "brb build"
  }
// ...
```

Start your app

```
$ npm start
```

Build your app

```
$ npm run build
```

## Customizing config

By default boiler-room-builder uses its own webpack configs. If you'd like to use another config you can just tell `brb` where to find yours.

```
$ brb serve \
  --server-config='./my.webpack.server.config' \
  --client-config='./my.webpack.client.config' \
  --dev-config='./my.webpack.dev.config'
```

N.B you only need pass in the specific config you'd like to change:

```
$ brb build --server-config='./only.change.the.webpack.server.config'
```

### Updating modifying default configs

You may want to only change a few things about the default configs: add or remove plugins / loaders for example.

To do this you can create your own config, import boiler-room-runner's, make your changes and export it:

#### `./webpack.server.config.js`

```
const defaultConfig = require('boiler-room-builder/webpack.server.config')
const { assign } = Object

module.exports = assign({}, defaultConfig, {
  output: assign({}, defaultConfig.output, {
    path: './somewhere/else'
  })
})
```

```
$ brb serve --server-config='./webpack.server.config'
```


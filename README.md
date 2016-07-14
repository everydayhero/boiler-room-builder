# Boiler Room Builder

A tool-chain for universal react apps

## Getting started

```
$ npm i boiler-room-builder@everydayhero/boiler-room-runner#v1.0.0-0
```

Now create both a `webpack.server.config.js` and a `webpack.client.config.js` file in the root of your project.

### `webpack.client.config.js`

```
module.exports = require('boiler-room-builder/webpack.client.config')
```

### `webpack.server.config.js`

```
module.exports = require('boiler-room-builder/webpack.server.config')
```

You can make any changes you like the default provided by both these configs.

### Start your app

```
$ node node_modules/boiler-room-builder
```


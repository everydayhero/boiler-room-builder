# Boiler Room Builder

A tool-chain for universal react apps

## Getting started

```
$ npm i boiler-room-builder@everydayhero/boiler-room-runner#v1.0.0-0
```

Now create both a `webpack.config.server.js` and a `webpack.config.client.js` file in the root of your project.

### `webpack.config.client.js`

```
module.exports = require('boiler-room-builder/webpack.config.client')
```

### `webpack.config.server.js`

```
module.exports = require('boiler-room-builder/webpack.config.server')
```

You can make any changes you like the default provided by both these configs.

### Start your app

```
$ node node_modules/boiler-room-builder
```


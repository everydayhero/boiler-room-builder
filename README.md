# Boiler Room Builder

A tool-chain for universal react apps

## Getting started

```
$ npm i boiler-room-builder@everydayhero/boiler-room-builder#v1.0.0-3
```

### Add the scripts to your `package.json`

```
// ...
  "scripts": {
    "start": "brb serve",
    "build": "brb build"
  }
// ...
```

### Create your `source/client.js` and `source/server.js` files

**Server.js**

If you use [Boiler room runner](https://github.com/everydayhero/boiler-room-runner#in-your-serverjs-file) to bootstrap your app, this will be simpler :).

Your server.js file must export a function which takes a compilation info object and returns an app function.

The app function must have an `empty()` method which will return the HTML document for your app, without any react content.

The app function will take a route return a Promise which may:
* Resolve to the rendered content for that route under a `result` key _or_
* Resolve to a path to redirect to under a `redirect` key _or_
* Reject with an error

```
export default function ({ assets = [] }) {
  function app (route = '/') {
    return Promise.resolve({
      result: '<html />',
      // OR
      redirect: '/another-location'
    })
  }

  app.empty = function empty () {
    // You might want to inject the assets list into your doc.
    return '<html>YOUR EMPTY HTML TEMPLATE</html>'
  }

  return app
}
```

**Client.js**

You can put pretty much anything in your client file, builder wont try to require and run it. It is however recommended that you use [Boiler room runner](https://github.com/everydayhero/boiler-room-runner#in-your-clientjs-file). It's got what you need.

### Start your app

```
$ npm start
```

### Build your app

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


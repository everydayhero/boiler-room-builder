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

## Options

### `--input-dir` default `./source`

Where we'll look for any app entry points (`server.js`, `client.js`)

### `--output-dir` default `./dist`

Where your compiled / bundled files will be output to. Where your dev server will serve content from.

### `--basepath` default `/`

This option should be changed whenever your app is not being served directly from `/`. It preforms a couple of functions.

* Any assets you require in your bundle will have this value prepended to them:
  ```
  import myImage from './my-image.png'
  // /base-path-setting/hashed-filename.png
  ```
* When running your dev server your app will be served from this directory (to mirror how it would be served in prod):
  ```
  $ brb serve --basepath='my-base-path'
  # App is now accessible from http://localhost:8080/my-base-path/
  ```

### Use the below only if you need to modify boiler room builder's default webpack configs

#### `--shared-config`

Relative path to a webpack config which will be merged into both client and server config.

#### `--client-config`

Relative path to a webpack config specific to the client bundle.

#### `--server-config`

Relative path to a webpack config specific to the server bundle.

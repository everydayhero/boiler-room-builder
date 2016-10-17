# Boiler Room Builder

[![Build status](https://badge.buildkite.com/3b53417ee3fb24b145098c129e6b31cc2ddc42d39d98ab0b52.svg?style=flat-square)](https://buildkite.com/everyday-hero/boiler-room-builder-tests)

You write the React app, Boiler Room Builder (BRB) handles the build configuration. With little effort you will be able to `build`, `test`, `lint` and `serve` like a pro.

## Getting started

Add BRB as a dependency to your project:
`npm install boiler-room-builder --save-dev`

### Add the scripts to your `package.json`

```
// ...
  "scripts": {
    "start": "brb serve",
    "build": "brb build",
    "lint": "brb lint",
    "lint:fix": "brb lint --fix",
    "lint:watch": "brb lint --watch",
    "test": "brb test",
    "test:debug": "brb test debug",
    "test:watch": "brb test --watch",
  }
// ...
```

### Create your `source/client.js` and `source/server.js` files

Refer to the [basic example](https://github.com/everydayhero/boiler-room-builder/tree/master/examples/basic), to see what a BRB setup looks like without any external libraries.

#### Server.js

Your server.js file must export a function which takes some compilation info and returns a function.

The returned function will take a route return a Promise which may:

* Resolve to the rendered content for that route under a `result` key _or_
* Resolve to a location to redirect to under a `redirect` key _or_
* Reject with an error

```
export default ({ assets = [] }) =>
  (route = '/') =>
    Promise.resolve({
      result: '<html />',
      // OR
      redirect: { pathname: '/another-location' }
    })
```

Why return a function like this? The exported function is passed into a Promise chain, which allows you to perform some async setup for your app before we try to call it to render any html.

If you use [Boiler Room Runner (BRR)](https://github.com/everydayhero/boiler-room-runner#in-your-serverjs-file) to bootstrap your app, this will be simpler :simple_smile:.

#### Client.js

You can put pretty much anything in your client file, BRB won't try to require and run it. It is however recommended that you use [Boiler Room Runner](https://github.com/everydayhero/boiler-room-runner#in-your-clientjs-file). It's got what you need.

### BRR's Purpose in BRB

Though BRR is not strictly necessary in any BRB project, BRR is included to provide a default document, in case you don’t provide your own exported `renderDocument` in `server.js`.

For example:
[`examples/basic/source/server.js`](https://github.com/everydayhero/boiler-room-builder/blob/master/examples/basic/source/server.js) exports its own `renderDocument` , while [`examples/runner/source/server.js`](https://github.com/everydayhero/boiler-room-builder/blob/master/examples/runner/source/server.js) does not, and instead uses the default provided by BRR.


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

### `--base-path` default `/`

This option should be changed whenever your app is not being served directly from `/`. It preforms a couple of functions.

* Any assets you require in your bundle will have this value prepended to them:
  ```
  import myImage from './my-image.png'
  // /base-path-setting/hashed-filename.png
  ```
* When running your dev server your app will be served from this directory (to mirror how it would be served in prod):
  ```
  $ brb serve --base-path='my-base-path'
  # App is now accessible from http://localhost:8080/my-base-path/
  ```

### Use the below only if you need to modify BRB's default webpack configs

#### `--config`

Relative path to a webpack config which will be merged into both client and server config.

#### `--client-config`

Relative path to a webpack config specific to the client bundle.

#### `--server-config`

Relative path to a webpack config specific to the server bundle.


## Test your application

```sh
npm run test
npm run test:watch # this is to watch your tests
```

BRB makes it easy to have your application tested using mocha.
By default it looks for your tests using the pattern `source/**/*-test.js`. If your source code is not under the `source` directory use the `--input-dir` param as described under the heading "Options".

## Lint your application

BRB makes it easy lint your application using StandardJS
If you want to manually run the linter (for example as part of a buildkite pipeline) or to use the `--fix` option run one of the commands described below.

```sh
npm run lint
npm run lint:fix # this is to autofix your lint failures
```
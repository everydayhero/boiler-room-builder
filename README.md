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
    "test": "brb test",
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
  (route = '/', request = {}) =>
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

#### `--middleware-config`

Relative path to a config containing `connect` middlewares. These middlewares will be
prepended to the middleware stack on both the dev and prod servers.

A middleware config file is a javascript module with an exports object that looks like this:

```js
const stats = require('stats-middleware')

module.exports = {
  middlewares: [
    {
      // Requirable javascript path - either an npm module or an absolute path
      middleware: '/path/to/middleware',
      // Options has that will be used to initialise the middleware. Only the typical
      // 'initialise with an options hash' middleware will work like this. If your
      // middleware needs to be initialised differently, require it and initialise it as below.
      options: {
        optionA: true,
        optionB: 'option'
      }
    },
    {
      // Probably the more typical use case: just require a middleware, set it up, and set
      // the resulting middleware function to the middleware key.
      middleware: stats({ /* ...config */ })
    }
  ]
}
```


## Test your application

BRB makes it easy to have your application tested using mocha.

By default it looks for your tests using the pattern `source/**/*-test.js`. If your source code is not under the `source` directory use the `--input-dir` param as described under the heading "Options".

```sh
$ npm run test
```

Your tests can be run in watch mode. When in watch mode changing a test file will re-run all your tests.

```sh
$ npm run test -- --watch
```

## Lint your application

BRB makes it easy to lint your application using StandardJS.

```sh
$ npm run lint
```

Some lint failures can be fixed automatically. To correct them, run the following.

```sh
$ npm run lint -- --fix
```

## Deploy your application

If you're producing a static site, BRB has a couple of deployment scripts to help get your site live (or on staging):

### S3

```sh
$ brb deploy --target s3
```

This can take the following flags:

- `--bucket` (required): The bucket name to deploy to
- `--prefix` (optional): Object name (S3 prefix) to target within the bucket
- `--dir` (optional): Directory of files to upload (defaults to `dist`)
- `--deleteRemoved` (optional): Whether or not to remove files not present in local `dir` (defaults to `true`)

The S3 publisher uses the AWS SDK under the hood, and therefore requires the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables to be set.

An example of a local publish might look like this:

**package.json:**

```json
{
  "scripts": {
    "build": "brb build",
    "deploy": "yarn build && brb deploy --target s3 --bucket mybucket.com --prefix mysite.mybucket.com"
  }
}
```

**shell:**

```sh
$ export AWS_ACCESS_KEY_ID=MYSPECIALKEY
$ export AWS_SECRET_ACCESS_KEY=MYSPECIALSECRET
$ yarn deploy
```

CI pipeline based deployment works very similarly. Instead of locally exporting, the AWS credentials will need to be specified in the pipeline configuration. Assuming a similar `package.json` set up is in use, `yarn deploy` would simply need to be a step in the build pipeline.

### GH Pages

```sh
$ brb deploy --target gh-pages
```

This can take the following flags:

- `--dir` (optional): Directory of files to upload (defaults to `dist`)

### AWS Lambda

```sh
$ brb deploy --target lambda
```

This can take the following flags:

- `--bucket` (required): The bucket name where the lambda is uploaded to
- `--fn-name` (required): The Lambda function name (this name is also used in Cloudformation and API Gateway)
- `--prefix` (optional): Folder name (S3 prefix) where the lambda is uploaded to
- `--dir` (optional): Directory of files to upload (defaults to `dist`)
- `--base-path` (optional): Required for staging when a custom domain is not set.

The Lambda publisher uses the AWS SDK under the hood, and therefore requires the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_ACCOUNT_ID` and `AWS_IAM_ROLE` environment variables to be set.

```json
{
  "scripts": {
    "build": "brb build",
    "deploy": "yarn build && brb deploy --target lambda --bucket mybucket.com --prefix mysite.mybucket.com --fn-name myFunction --base-path /base-path/"
  }
}
```

**shell:**

```sh
$ export AWS_ACCESS_KEY_ID=MYSPECIALKEY
$ export AWS_SECRET_ACCESS_KEY=MYSPECIALSECRET
$ export AWS_REGION=us-east-1
$ export AWS_ACCOUNT_ID=MY_ACCOUNT_ID
$ export AWS_IAM_ROLE=LambdaLogWriter
$ yarn deploy
```

## Publishing new versions to NPM

Once your changes are merged use a single version bump commit to trigger publishing to npm. The easiest way is to use the [npm version](https://docs.npmjs.com/cli/version) command, for example:

`npm version [major | minor | patch]`

Then push to `master` with `git push origin master --follow-tags`.

Make sure you bump the version as per [semver](http://semver.org/).

## Upgrading to version 3.0

Boiler Room Builder 3.0 is a major version dependencies update,. It now uses the Webpack 4.x, Babel 7.x,
and Standard 12.x. Please refer to the docs for each individual dependency for how this change might affect your app.

The most outward facing change to look out for is that as of Babel 7, `babel-preset-stage-0` no longer exists. Babel's
recommendation is to explicitly import on any experimental features you need. You probably aren't using a `stage`
feature in your app, but if you are you'll need to include the specific transform or plugin from Babel in your own
app's Babel config.

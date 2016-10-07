# Assets

This example uses boiler room runner and shows builder's support for different asset types and how you might use them in your apps.

## To base your app off this example

Copy everything to a new directory.

```
$ cp -R ./path-to/boiler-room-builder/examples/assets ./path-to/your-project
```

Install dependencies

```
$ cd ./path-to/your-project
$ npm i
```

Make sure to now install boiler-room-builder as a depenency. It's a good idea to lock your install to a specific version:

```
$ npm i boiler-room-builder@everydayhero/boiler-room-builder#VERSION_TAG --save-dev
```

Now you should be able to start your app:

```
$ npm start
```

Open your browser at http://localhost:8080

## What this example is for

This is an example of requiring static assets into your bundle. You'll see [`.gif`](https://github.com/everydayhero/boiler-room-builder/blob/master/examples/assets/source/components/About/index.js), [`.jpg`](https://github.com/everydayhero/boiler-room-builder/blob/master/examples/assets/source/components/Home/index.js) and [`.css`/`.scss`](https://github.com/everydayhero/boiler-room-builder/tree/master/examples/assets/source/components/Root) files being required in `.js` files.

It's also an example of using boiler-room-runner to init both the [server](https://github.com/everydayhero/boiler-room-builder/blob/master/examples/assets/source/server.js) and [client](https://github.com/everydayhero/boiler-room-builder/blob/master/examples/assets/source/client.js) versions of your app.

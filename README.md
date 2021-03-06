# Deja Wu

Déjà Wù is a chrome extension that can help users find stuff they've seen.

![Example](https://searchengineland.com/figz/wp-content/seloads/2018/09/Chrome_Omnibox-search.gif)

## How to run
Before you get started, please check out [this tutorial on Webpack](https://www.youtube.com/watch?v=GU-2T7k9NfI). Then go through the following:

1. Check if your Node.js version is >= 6.
2. Clone the repository.
3. Install [yarn](https://yarnpkg.com/lang/en/docs/install/).
4. Run `yarn`.
5. Run `npm run start`
6. Load your extension on Chrome following:
    1. Access `chrome://extensions/`
    2. Check `Developer mode`
    3. Click on `Load unpacked extension`
    4. Select the `build` folder.

## Structure
All the extension's development code is placed in `src` folder, including the extension manifest.

Each page has its own [assets package defined](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate/blob/master/webpack.config.js#L16-L20). So, to code on popup you must start your code on `src/js/popup.js`, for example.

You must use the [ES6 modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) to a better code organization. The boilerplate is already prepared to that and [here you have a little example](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate/blob/master/src/js/popup.js#L2-L4).

## Webpack auto-reload and HRM
To make your workflow much more efficient this boilerplate uses the [webpack server](https://webpack.github.io/docs/webpack-dev-server.html) to development (started with `npm run server`) with auto reload feature that reloads the browser automatically every time that you save some file o your editor.

You can run the dev mode on other port if you want. Just specify the env var `port` like this:

```
$ PORT=6002 npm run start
```

```

## Packing
After the development of your extension run the command

```
$ NODE_ENV=production npm run build
```
Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

## Secrets
If you are developing an extension that talks with some API you probably are using different keys for testing and production. Is a good practice you not commit your secret keys and expose to anyone that have access to the repository.

To this task this boilerplate import the file `./secrets.<THE-NODE_ENV>.js` on your modules through the module named as `secrets`, so you can do things like this:

_./secrets.development.js_

```js
export default { key: "123" };
```

_./src/popup.js_

```js
import secrets from "secrets";
ApiCall({ key: secrets.key });
```
:point_right: The files with name `secrets.*.js` already are ignored on the repository.

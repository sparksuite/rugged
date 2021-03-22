---
title: Node.js environment
slug: /suggested-projects/node
---

## When to test

- Your package runs in Node.js

## What to test

Test that your package works in Node.js. This is especially important if your package can also run in a browser, since there are many differences between the two environments.

## How to set up

If you’re using Jest, you can make sure the [`testEnvironment`](https://jestjs.io/docs/configuration#testenvironment-string) configuration option is set to `node`, and not the default of `jsdom`. You can also run `node` directly in your test project’s `test` script, like:

```json {3} title="test-projects/node/package.json"
{
    "scripts": {
        "test": "node index.js"
    }
}
```

## Common problems to watch for

### Unavailable global variables

Some global variables, like `window` won’t be available in Node.js.

```js
console.log(window); // ReferenceError: window is not defined
```
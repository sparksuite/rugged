---
title: ES module system
slug: /suggested-projects/esm
---

## When to test

- Your package runs in Node.js
- Your package is expected to be imported/required by projects

## What to test

Test that your package works in projects that use the ES module system (a.k.a., “ECMAScript modules”) and use ES6-style import/export syntax.

## How to set up

Specify the module type in the `package.json` file:

```json {4} title="test-projects/example/package.json"
{
    "name": "es-module-system",
    "version": "0.0.0", 
    "type": "module",
    "scripts": {
        "test": "jest"
    }
}
```

## Common problems to watch for

### Import syntax

Make sure that your package can be imported successfully and without using `* as`.

```js
import yourPackage from 'your-package'; // Good
import * as yourPackage from 'your-package'; // Bad
```

### Use of `require()`

If your package attempts to `require()` a file from the project using your package, you may encounter a `ERR_REQUIRE_ESM` error. This is because you can’t use `require()` to load an ES module.

```js
const someFile = require(path.join(process.cwd(), 'some-file.js')); // Probably won’t work
```
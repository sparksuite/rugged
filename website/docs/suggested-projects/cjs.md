---
title: Common JS module system
slug: /suggested-projects/cjs
---

## When to test

- Your package runs in Node.js
- Your package is expected to be imported/required by projects

## What to test

Test that your package works in projects that use the Common JS module system, the default module system in Node.js. This is especially important if your package is written and tested using the ES module system.

## How to set up

Specify the module type in the `package.json` file:

```json {2} title="test-projects/cjs-module-system/package.json"
{
    "type": "commonjs",
    "scripts": {
        "test": "jest"
    }
}
```

## Common problems to watch for

### Require syntax

Make sure that your package can be required successfully and without using `.default`.

```js
const yourPackage = require('your-package'); // Good
const yourPackage = require('your-package').default; // Bad
```

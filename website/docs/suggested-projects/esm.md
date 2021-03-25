---
title: ES module system
slug: /suggested-projects/esm
---

## When to test

- Your package runs in Node.js
- Your package is expected to be imported/required by projects
- Your package uses a conditional export for the ES module system
  - Via the `exports` key in the `package.json` file

## What to test

Test that your package works in projects that use the ES module system (a.k.a., “ECMAScript modules”) and use ES6-style import/export syntax. This is especially important if your package is written and tested using the Common JS module system.

## How to set up

Specify the module type in the `package.json` file:

```json {2} title="test-projects/es-module-system/package.json"
{
    "type": "module",
    "scripts": {
        "test": "jest"
    }
}
```

## Common problems to watch for

### External import syntax

Make sure that your package can be imported successfully and without using `* as`.

```js
import yourPackage from 'your-package'; // Good
import * as yourPackage from 'your-package'; // Bad
```

### Internal import syntax

This is especially important if you’re using a compiler/transpiler like TypeScript. Make sure that internal imports don’t throw `ERR_MODULE_NOT_FOUND` errors.

Consider the following two TypeScript files:

```ts title="./bar.ts"
export default function bar() {
    return 'bar';
}
```

```ts title="./foo.ts"
import bar from './bar';
bar();
```

Consider also the following configuration directives:

```json {3-4} title="tsconfig.json"
{
	"compilerOptions": {
		"module": "ESNext",
		"target": "ES2020"
	}
}
```

```json {2} title="package.json"
{
	"type": "module",
}
```

If you run tests directly against the TypeScript source files with a test runner like Jest, chances are your tests will pass. But, when you run the compiled version, you may encounter `ERR_MODULE_NOT_FOUND` errors stating that the `./bar` file can't be found. To fix this (in this scenario), you must add `.js` to the end of every import path:

```ts {1} title="./foo.ts"
import bar from './bar.js';
bar();
```

### Use of `require()`

If your package attempts to `require()` a file from the project using your package, you may encounter a `ERR_REQUIRE_ESM` error. This is because you can’t use `require()` to load an ES module.

```js
const someFile = require(path.join(process.cwd(), 'some-file.js')); // Probably won’t work
```
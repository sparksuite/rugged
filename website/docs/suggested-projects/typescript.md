---
title: TypeScript
slug: /suggested-projects/typescript
---

## When to test

- Your package could be run in a project written using TypeScript
  - Since TypeScript is a superset of JavaScript, most, if not all, JavaScript packages will work in TypeScript projects

## What to test

Test that your package works in a project using TypeScript, and can be required/imported naturally.

## How to set up

Install `typescript` as a dev dependency for the project. Afterward, you will need to set up a minimal TSConfig file (you can read more on those configuration options [here](https://www.typescriptlang.org/tsconfig)). Set the script you use to compile to the tool you intend to use to compile/transpile your TypeScript project into JavaScript (some common examples are `tsc` and `babel`, with Babel needing additional [configuration](https://github.com/microsoft/TypeScript-Babel-Starter)). Lastly, in your `package.json` set the `main` configuration option to where the entry point to your project will be generated after compiling based on configuration options. There are many tools that could be used to test your project, and those tools might need additional configuration to work with TypeScript as well.

## Common problems to watch for

### Import syntax

Make sure that your package can be imported successfully and without using `* as`.

```js
import yourPackage from 'your-package'; // Good
import * as yourPackage from 'your-package'; // Bad
```

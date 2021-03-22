---
title: TypeScript
slug: /suggested-projects/typescript
---

## When to test

- Your package runs in projects using Typescript

## What to test

Test that your package works in a project using Typescript. 

## How to set up

Install `typescript` as a dev-dependency for the project. Afterwards you will need to set up a minimal TSConfig (you can read more on those configuration options [here](https://www.typescriptlang.org/tsconfig)). Set the script you use to compile to the tool you intend to use to compile/transpile your Typescript project into Javascript (some common examples are `tsc`/`babel` as a side note, Babel will require it's own additional [configuration](https://github.com/microsoft/TypeScript-Babel-Starter)). Lastly, in your `package.json` set the `main` configuration option to where the entry point to your project will be generated after compiling based on configuration options. There are many tools that could be used to test your project, and those tools might need additional configuration to work with Typescript as well.

## Common problems to watch for

TODO

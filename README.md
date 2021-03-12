# <div align="center">Rugged</div>

<p align="center">
    <a href="https://www.npmjs.com/package/rugged">
        <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/rugged">
    </a>
    <a href="https://app.codecov.io/gh/sparksuite/rugged/branch/master">
        <img alt="Codecov coverage" src="https://img.shields.io/codecov/c/github/sparksuite/rugged">
    </a>
    <a href="https://www.npmjs.com/package/rugged">
        <img alt="npm downloads" src="https://img.shields.io/npm/dw/rugged">
    </a>
    <a href="https://www.npmjs.com/package/rugged">
        <img alt="npm release" src="https://img.shields.io/npm/v/rugged">
    </a>
    <a href="https://github.com/sparksuite/rugged/blob/master/LICENSE">
        <img alt="license" src="https://img.shields.io/npm/l/rugged">
    </a>
</p>

Rugged orchestrates testing JavaScript packages across the variety of environments and contexts where it’s actually being used, with the files that will actually be published.

- ⚡️ Performance design
- 🔧 Easily configurable
- 📦 Written entirely in TypeScript
- 🔬 Thoroughly tested
- ✨ Tiny size
- 📖 Well documented

## The problem

Today, people can consume your package in many contexts—in Node.js, in a browser, in an ECMAScript module, in a Common JS module, within a library (e.g., React, Angular, etc.), with assistance from compilers/transpilers/bundlers (e.g., TypeScript, Babel, Webpack, etc.), even inside test runners (e.g., Jest, Mocha, etc.). Each of these contexts has a unique set of capabilities, limitations, requirements, global variables, etc. that could impact or even break your package’s behavior.

Further, testing often only occurs against the source files that are available in the repository, which is problematic in two ways… First, tools may manipulate the source code in such a way that the compiled/transpiled/bundled version behaves slightly differently than the source code. Second, misconfigurations in your `package.json` may cause necessary files to be excluded from the published version of your package.

## How Rugged helps

Rugged facilitates testing your package in the environments and contexts where your package will be used, using the files that would be published (i.e., the compiled/transpiled/bundled files that are included according to your `package.json` settings).

You do this by creating a variety of minimal test projects that mimic what projects that use your package could look like. These test projects live in your package’s repository and simply need a `test` script in their `package.json` files. Rugged will run these scripts in each test project to verify your package works as expected in each environment/context.

## Quick start

Install with Yarn or npm:

```
yarn add --dev rugged
```

```
npm install --save-dev rugged
```

Create a `test-projects/` directory with at least one test project inside of it (check out [Rugged’s test project directory](https://github.com/sparksuite/rugged/tree/master/test-projects) for examples).

Add `rugged` to the `test` script in the `package.json` file:

```json
{
    "scripts": {
        "test": "rugged"
    }
}
```

Done!

## Documentation

Read the docs at: https://ruggedjs.io/docs/

## Contributing

We love contributions! Contributing is easy; [learn how](https://github.com/sparksuite/rugged/blob/master/CONTRIBUTING.md).

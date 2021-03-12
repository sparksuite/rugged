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
    <a href="https://github.com/sparksuite/rugged">
        <img alt="tested with Rugged" src="https://img.shields.io/badge/tested%20with-Rugged-green">
    </a>
    <a href="https://github.com/sparksuite/rugged/blob/master/LICENSE">
        <img alt="license" src="https://img.shields.io/npm/l/rugged">
    </a>
</p>

Rugged orchestrates testing JavaScript packages across the variety of real-world environments and contexts where they’ll actually be used, with the files that will actually be published.

- ⚡️ Performant design
- 🔧 Configurable
- 📦 Written entirely in TypeScript
- 🌎 Works in CLI and CI environments
- 🔬 Thoroughly tested
- ✨ Tiny size
- 📖 Well documented

![Screen recording](https://user-images.githubusercontent.com/3850064/110968462-2bf99800-831d-11eb-98f8-b3ded33a08a8.gif)

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

## Badge

Let the world know your package is being tested with Rugged!

```markdown
[![tested with Rugged](https://img.shields.io/badge/tested%20with-Rugged-green)](https://github.com/sparksuite/rugged)
```

```html
<a href="https://github.com/sparksuite/rugged">
    <img alt="tested with rugged" src="https://img.shields.io/badge/tested%20with-Rugged-green">
</a>
```

## Contributing

We love contributions! Contributing is easy; [learn how](https://github.com/sparksuite/rugged/blob/master/CONTRIBUTING.md).

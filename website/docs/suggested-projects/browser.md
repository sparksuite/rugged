---
title: Browser environment
slug: /suggested-projects/browser
---

## When to test

- Your package runs in a browser

## What to test

Test that your package works in a browser environment. This is especially important if your package can also run in Node.js, since there are many differences between the two environments.

## How to set up

There are many ways to set this up. If you’re using Jest, you can use its [`testEnvironment`](https://jestjs.io/docs/configuration#testenvironment-string) configuration option. For more rigorous testing, you can use a headless browser through a library like [Puppeteer](https://github.com/puppeteer/puppeteer).

## Common problems to watch for

TODO
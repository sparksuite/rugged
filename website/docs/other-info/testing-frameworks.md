---
title: Testing frameworks
slug: /other-info/testing-frameworks
---

It’s important to note that Rugged is what we call a “test orchestrator,” not a fully-fledged testing framework like Jest, Mocha, Jasmine, etc. As such, Rugged doesn’t replace any testing framework(s) you may already be using; rather, it complements these framework(s) by facilitating the process of testing your package across a variety of test projects—which replicate the different contexts in which your package could be used.

In fact, many, if not all, of your package’s test projects will probably have a testing framework installed, which you’ll use with the `test` script:

```json title="test-projects/example/package.json"
{
    "scripts": {
        "test": "jest"
    },
    "devDependencies": {
        "jest: "*"
    }
}
```
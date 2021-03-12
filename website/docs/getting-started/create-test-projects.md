---
title: Create test projects
slug: /getting-started/create-test-projects
---

For Rugged to work, your repository must contain at least one test project. By default, these are contained within the `test-projects/` directory at the root of your repository.

Test projects are independent of one another, and should be relatively-minimal versions of what projects that use your package would look like.

Each test project must have a `package.json` file with a `test` script:

```json {3} title="test-projects/example/package.json"
{
    "scripts": {
        "test": "jest"
    }
}
```

---
title: Create test projects
slug: /getting-started/create-test-projects
---

For Rugged to work, your repository must contain at least one test project. By default, these are contained within the `test-projects/` directory at the root of your repository.

Test projects are independent of one another, and should be relatively-minimal versions of what projects that use your package would look like.

Each test project just needs a `package.json` file with a `test` script. Rugged will run this test script in each test project.

```json {3} title="test-projects/example/package.json"
{
    "scripts": {
        "test": "jest"
    }
}
```

Every package is unique and will require a different set of test projects. However, we have a handful of test project suggestions, which you can find in the sidebar on the left.

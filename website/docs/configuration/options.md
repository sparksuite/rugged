---
title: Options
slug: /configuration/options
---

Rugged supports a number of configuration options, as defined below. These can be used with either a [configuration file](file.md) or [command line arguments](cli.md).

Option | Default | Explanation
--- | --- | ---
`compileScriptName` | `compile` | Which `package.json` script to run to compile the root project. The compilation step will be skipped if the script does not exist.
`injectAsDevDependency` | `false` | Whether to inject the root package into the `devDependencies` object instead of the `dependencies` object in the `package.json` file.
`printSuccessfulOutput` | `false` | Whether to print successful test output, in addition to failed test output.
`testInParallel` | `true` | Whether to run tests in parallel.
`testProjectsDirectory` | `test-projects` | Which directory to search for test projects.
`yarnMutexPort` | `31997` | The port Yarn commands should use for the `--mutex` flag.


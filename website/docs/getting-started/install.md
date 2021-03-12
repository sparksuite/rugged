---
title: Install
slug: /
---

Installation is simple. First, run one of the following two commands, depending on whether you’re using Yarn or npm:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
groupId="package-manager"
defaultValue="yarn"
values={[
{label: 'Yarn', value: 'yarn'},
{label: 'npm', value: 'npm'},
]}>
<TabItem value="yarn">

```bash
yarn add --dev rugged
```

</TabItem>
<TabItem value="npm">

```bash
npm install --save-dev rugged
```

</TabItem>
</Tabs>

Then, add `rugged` to the `package.json` file’s `test` script:

```json {3} title="package.json"
{
    "scripts": {
        "test": "rugged"
    }
}
```

If you already have a `test` script, add `&& rugged` to the end of it:

```json {3} title="package.json"
{
    "scripts": {
        "test": "... && rugged"
    }
}
```

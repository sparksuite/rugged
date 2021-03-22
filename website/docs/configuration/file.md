---
title: Config file
slug: /configuration/file
---

Rugged supports a configuration file at the root of the repository, written in either TypeScript or JavaScript. The file can use any of the available [config options](options.md).

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
groupId="language"
defaultValue="ts"
values={[
{label: 'TypeScript', value: 'ts'},
{label: 'JavaScript', value: 'js'},
]}>
<TabItem value="ts">

```ts title="rugged.config.ts"
import { Config } from 'rugged';

const config: Config = {
    // Config options go here
};

export default config;
```

</TabItem>
<TabItem value="js">

```js title="rugged.config.js"
module.exports = {
    // Config options go here
};
```

</TabItem>
</Tabs>
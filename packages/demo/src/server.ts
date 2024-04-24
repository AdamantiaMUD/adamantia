import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { AdamantiaServer, type MudConfig } from '@adamantiamud/core';

/* eslint-disable-next-line @typescript-eslint/naming-convention, id-match */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/* eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-commonjs */
const serverConfig = require('./adamantia.json') as MudConfig;

const server = new AdamantiaServer({
    ...serverConfig,
    paths: {
        bundles: path.join(__dirname, 'bundles'),
        data: path.join(__dirname, '..', 'data'),
        root: __dirname,
    },
});

await server.init();

server.start();

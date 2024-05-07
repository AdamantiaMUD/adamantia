/* eslint-disable import/no-nodejs-modules */
import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 4002,
    },
    resolve: {
        alias: {
            /* eslint-disable-next-line @typescript-eslint/naming-convention */
            '~': path.resolve(__dirname, './src'),
        },
    },
    plugins: [react()],
});

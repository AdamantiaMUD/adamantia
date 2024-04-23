import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            /* eslint-disable-next-line @typescript-eslint/naming-convention */
            '~': path.resolve(__dirname, './src'),
        },
    },
    plugins: [react()],
});

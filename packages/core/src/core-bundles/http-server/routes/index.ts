import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import areaRoutes from './areas/index.js';
import roomRoutes from './rooms/index.js';

const routes: FastifyPluginAsyncTypebox = async (app, opts) => {
    await app.register(areaRoutes, { prefix: '/areas' });
    await app.register(roomRoutes, { prefix: '/rooms' });
};

export default routes;

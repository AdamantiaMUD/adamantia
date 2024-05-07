import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import singleRoomRoutes from './[roomId]/index.js';

const routes: FastifyPluginAsyncTypebox = async (app, opts) => {
    await app.register(singleRoomRoutes, { prefix: '/:roomId' });
};

export default routes;

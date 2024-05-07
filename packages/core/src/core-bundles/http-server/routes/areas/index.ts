import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { FastifyReply, FastifyRequest } from 'fastify';

import singleAreaRoutes from './[areaId]/index.js';

const getAreaList = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
    const { mud } = request.server;

    const areas: Array<{
        id: string;
        name: string;
        description: string;
        roomCount: number;
    }> = [];

    Object.values(mud.areaManager.areas).forEach((area) => {
        areas.push({
            id: area.entityReference,
            name: area.name,
            description: area.description,
            roomCount: area.rooms.size,
        });
    });

    await reply.send(areas);
};

const routes: FastifyPluginAsyncTypebox = async (app, opts) => {
    app.get('/', getAreaList);

    await app.register(singleAreaRoutes, { prefix: '/:areaId' });
};

export default routes;

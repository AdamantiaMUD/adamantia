import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { FastifyReply, FastifyRequest } from 'fastify';

import {
    areaSchema,
    getAreaRequestParams,
} from '../../../utils/route-utils.js';

import areaGraphRoutes from './graph.js';
import areaRoomRoutes from './rooms.js';

const getAreaById = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
    const { mud } = request.server;
    const params = getAreaRequestParams(request);

    const area = mud.areaManager.getArea(params.areaId);
    if (area === null) {
        await reply.status(404).send({ error: 'Area not found' });

        return;
    }

    await reply.send({
        id: area.entityReference,
        name: area.name,
        description: area.description,
    });
};

const routes: FastifyPluginAsyncTypebox = async (app, opts) => {
    app.get('/', areaSchema, getAreaById);

    await app.register(areaRoomRoutes, { prefix: '/rooms' });
    await app.register(areaGraphRoutes, { prefix: '/graph' });
};

export default routes;

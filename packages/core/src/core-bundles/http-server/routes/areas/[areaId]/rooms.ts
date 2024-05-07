import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { FastifyReply, FastifyRequest } from 'fastify';

import {
    areaSchema,
    getAreaRequestParams,
} from '../../../utils/route-utils.js';

const getAreaRooms = async (
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

    await reply.send(
        Array.from(area.rooms.values()).map((room) => ({
            id: room.entityReference,
            name: room.name,
            description: room.description,
        }))
    );
};

const routes: FastifyPluginAsyncTypebox = async (app, opts) => {
    app.get('/', areaSchema, getAreaRooms);
};

export default routes;

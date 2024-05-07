import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { FastifyReply, FastifyRequest } from 'fastify';

import {
    getRoomRequestParams,
    roomSchema,
} from '../../../utils/route-utils.js';

const getRoomById = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
    const { mud } = request.server;
    const params = getRoomRequestParams(request);

    const room = mud.roomManager.getRoom(params.roomId);
    if (room === null) {
        await reply.status(404).send({ error: 'Room not found' });

        return;
    }

    await reply.send(room.def);
};

const routes: FastifyPluginAsyncTypebox = async (app, opts) => {
    app.get('/', roomSchema, getRoomById);
};

export default routes;

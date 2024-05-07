import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { clone } from '../../../../../lib/util/objects.js';
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

    const roomDef = clone(room.def);
    const { exits } = roomDef;
    roomDef.exits = (exits ?? []).map((exit) => ({
        ...exit,
        name: mud.roomManager.getRoom(exit.roomId)?.name ?? '!Missing Room!',
    }));

    await reply.send(roomDef);
};

const routes: FastifyPluginAsyncTypebox = async (app, opts) => {
    app.get('/', roomSchema, getRoomById);
};

export default routes;

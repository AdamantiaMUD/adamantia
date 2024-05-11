import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import type {
    AdamantiaReply,
    AdamantiaRequest,
} from '../../../utils/route-utils.js';

import areaGraphRoutes from './graph.js';
import areaRoomRoutes from './rooms.js';

interface GetAreaByIdRoute {
    Params: {
        areaId: string;
    };
}

const getAreaById = async (
    request: AdamantiaRequest<GetAreaByIdRoute>,
    reply: AdamantiaReply<GetAreaByIdRoute>
): Promise<void> => {
    const { mud } = request.server;
    const { params } = request;

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
    app.get('/', getAreaById);

    await app.register(areaRoomRoutes, { prefix: '/rooms' });
    await app.register(areaGraphRoutes, { prefix: '/graph' });
};

export default routes;

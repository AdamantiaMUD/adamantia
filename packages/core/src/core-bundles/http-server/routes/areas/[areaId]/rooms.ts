import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import type {
    AdamantiaReply,
    AdamantiaRequest,
} from '../../../utils/route-utils.js';

interface GetAreaRoomsRoute {
    Params: {
        areaId: string;
    };
}

const getAreaRooms = async (
    request: AdamantiaRequest<GetAreaRoomsRoute>,
    reply: AdamantiaReply<GetAreaRoomsRoute>
): Promise<void> => {
    const { mud } = request.server;
    const { params } = request;

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
    app.get('/', getAreaRooms);
};

export default routes;

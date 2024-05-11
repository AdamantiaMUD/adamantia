import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import AreaGraphGenerator from '../../../utils/area-graph.js';
import type {
    AdamantiaReply,
    AdamantiaRequest,
} from '../../../utils/route-utils.js';

interface GetAreaGraphRoute {
    Params: {
        areaId: string;
    };
}

const getAreaGraph = async (
    request: AdamantiaRequest<GetAreaGraphRoute>,
    reply: AdamantiaReply<GetAreaGraphRoute>
): Promise<void> => {
    const { mud } = request.server;
    const { params } = request;

    const area = mud.areaManager.getArea(params.areaId);
    if (area === null) {
        await reply.status(404).send({ error: 'Area not found' });

        return;
    }

    if (Array.from(area.rooms.values()).length === 0) {
        await reply.send({
            name: area.name,
            rooms: [],
            nodes: [],
        });

        return;
    }

    const generator = new AreaGraphGenerator(area, mud.areaManager);

    await reply.send(generator.generate());
};

const routes: FastifyPluginAsyncTypebox = async (app, opts) => {
    app.get('/', getAreaGraph);
};

export default routes;

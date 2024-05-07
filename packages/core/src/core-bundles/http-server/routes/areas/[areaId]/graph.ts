import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { FastifyReply, FastifyRequest } from 'fastify';

import AreaGraphGenerator from '../../../utils/area-graph.js';
import {
    areaSchema,
    getAreaRequestParams,
} from '../../../utils/route-utils.js';

const getAreaGraph = async (
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
    app.get('/', areaSchema, getAreaGraph);
};

export default routes;

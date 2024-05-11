import fs from 'node:fs/promises';

import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import merge from 'deepmerge';

import type { RoomDefinition } from '../../../../../lib/locations/room-definition.js';
import { clone } from '../../../../../lib/util/objects.js';
import type {
    AdamantiaReply,
    AdamantiaRequest,
} from '../../../utils/route-utils.js';

interface GetRoomByIdRoute {
    Params: {
        roomId: string;
    };
    Reply: RoomDefinition;
}

const getRoomById = async (
    request: AdamantiaRequest<GetRoomByIdRoute>,
    reply: AdamantiaReply<GetRoomByIdRoute>
): Promise<void> => {
    const { mud } = request.server;
    const { params } = request;

    const room = mud.roomManager.get(params.roomId);
    if (room === null) {
        await reply.status(404).send({ error: 'Room not found' });

        return;
    }

    const roomDef = clone(room.def);
    const { exits } = roomDef;
    roomDef.exits = (exits ?? []).map((exit) => ({
        ...exit,
        name: mud.roomManager.get(exit.roomId)?.name ?? '!Missing Room!',
    }));

    await reply.send(roomDef);
};

export type UpdateRoomByIdRequest = Partial<RoomDefinition>;
export type UpdateRoomByIdResponse = RoomDefinition;

interface UpdateRoomByIdRoute {
    Body: UpdateRoomByIdRequest;
    Params: {
        roomId: string;
    };
    Reply: RoomDefinition;
}

const updateRoomById = async (
    request: AdamantiaRequest<UpdateRoomByIdRoute>,
    reply: AdamantiaReply<UpdateRoomByIdRoute>
): Promise<void> => {
    const { mud } = request.server;
    const { params } = request;

    const room = mud.roomManager.get(params.roomId);
    if (room === null) {
        await reply.status(404).send({ error: 'Room not found' });

        return;
    }

    const roomDef = request.body;
    const updatedDef = merge(room.def, roomDef);
    const filePath = mud.roomManager.getPath(params.roomId)!;

    await fs.writeFile(filePath, JSON.stringify(updatedDef, null, 4));

    await reply.status(200).send(updatedDef);
};

const routes: FastifyPluginAsyncTypebox = async (app, opts) => {
    app.get('/', getRoomById);
    app.put('/', updateRoomById);
};

export default routes;

/* eslint-disable no-restricted-syntax */
import fs from 'node:fs/promises';
import path from 'node:path';

import {
    Direction,
    type RoomDefinition,
    type RoomExitDefinition,
} from '@adamantiamud/core';
import type { EdgeDefinition } from 'cytoscape';
import type { PartialDeep } from 'type-fest';

import type { AreaGraph, RoomElementDefinition } from '../types/area-graph.js';

if (process.argv.length < 5) {
    console.error('Expected 3 arguments: areaPath, areaName, areaId');
    process.exit(1);
}

const areaPath = process.argv[2];
const areaName = process.argv[3];
const areaId = process.argv[4];

console.log(
    `Building area graph for:\n${path.resolve(areaPath)}\n${areaName}\n${areaId}`
);

const basePath = path.resolve(areaPath);

const rooms: Record<string, RoomDefinition> = {};
const roomIds: string[] = [];
const processedIds: string[] = [];
const cyNodes: Array<RoomElementDefinition | EdgeDefinition> = [];

type RoomWithExits = Omit<RoomDefinition, 'exits'> & {
    exits: RoomExitDefinition[];
};

const checkRoom = (
    room: RoomDefinition | undefined,
    roomId: string
): room is RoomWithExits => {
    if (typeof room === 'undefined') {
        console.log(`Room not found: ${roomId}`);
        return false;
    }

    if (typeof room.exits === 'undefined') {
        console.log(`Room has no exits: ${JSON.stringify(room, null, 2)}`);
        return false;
    }

    return true;
};

const loadFile = async (file: string): Promise<RoomDefinition> => {
    const contents = await fs.readFile(
        path.join(basePath, 'rooms', file),
        'utf8'
    );

    return JSON.parse(contents) as RoomDefinition;
};

const processFolder = async (): Promise<void> => {
    const files = await fs.readdir(path.join(basePath, 'rooms'), {
        withFileTypes: true,
    });

    for (const file of files) {
        if (
            !file.isDirectory() &&
            file.name.startsWith('r') &&
            path.extname(file.name) === '.json'
        ) {
            /* eslint-disable-next-line no-await-in-loop */
            const room = await loadFile(file.name);
            rooms[`${areaId}:${room.id}`] = room;
            roomIds.push(`${areaId}:${room.id}`);
        }
    }
};

const processExit = (
    roomId: string,
    exit: RoomExitDefinition,
    roomData: RoomElementDefinition
): null | [string, RoomElementDefinition] => {
    const targetId = exit.roomId;
    const direction = exit.direction;

    cyNodes.push({
        data: {
            source: roomId,
            target: targetId,
        },
        group: 'edges',
        removed: false,
        selected: false,
        locked: false,
        grabbable: false,
    } as EdgeDefinition);

    if (!processedIds.includes(targetId)) {
        processedIds.push(targetId);

        const targetData: PartialDeep<RoomElementDefinition> = {
            data: {
                id: targetId,
                label: targetId.replace(`${areaId}:`, ''),
            },
            group: 'nodes',
        };

        switch (direction) {
            case Direction.NORTH:
                targetData.position = {
                    x: roomData.position.x,
                    y: roomData.position.y - 20,
                };
                targetData.data!.layer = roomData.data.layer;
                break;
            case Direction.SOUTH:
                targetData.position = {
                    x: roomData.position.x,
                    y: roomData.position.y + 20,
                };
                targetData.data!.layer = roomData.data.layer;
                break;
            case Direction.EAST:
                targetData.position = {
                    x: roomData.position.x + 20,
                    y: roomData.position.y,
                };
                targetData.data!.layer = roomData.data.layer;
                break;
            case Direction.WEST:
                targetData.position = {
                    x: roomData.position.x - 20,
                    y: roomData.position.y,
                };
                targetData.data!.layer = roomData.data.layer;
                break;
            case Direction.UP:
                targetData.position = {
                    x: roomData.position.x,
                    y: roomData.position.y,
                };
                targetData.data!.layer = roomData.data.layer + 1;
                break;
            case Direction.DOWN:
                targetData.position = {
                    x: roomData.position.x,
                    y: roomData.position.y,
                };
                targetData.data!.layer = roomData.data.layer - 1;
                break;
            default:
                break;
        }

        cyNodes.push(targetData as RoomElementDefinition);

        return [targetId, targetData as RoomElementDefinition];
    }

    return null;
};

const processRoom = (roomId: string, roomData: RoomElementDefinition): void => {
    const room = rooms[roomId];

    if (!checkRoom(room, roomId)) {
        return;
    }

    for (const exit of room.exits) {
        const exitResult = processExit(roomId, exit, roomData);
        if (exitResult !== null) {
            processRoom(exitResult[0], exitResult[1]);
        }
    }
};

const processRooms = (): void => {
    const id = roomIds[0];

    processedIds.push(id);

    const roomData: RoomElementDefinition = {
        data: {
            id: id,
            label: id.replace(`${areaId}:`, ''),
            layer: 0,
        },
        group: 'nodes',
        position: {
            x: 0,
            y: 0,
        },
    };

    cyNodes.push(roomData);

    processRoom(id, roomData);
};

await processFolder();
processRooms();

const areaGraph: AreaGraph = {
    name: areaName,
    rooms: rooms,
    nodes: cyNodes,
};

await fs.writeFile(
    path.join(basePath, 'area-graph.json'),
    JSON.stringify(areaGraph, null, 4)
);

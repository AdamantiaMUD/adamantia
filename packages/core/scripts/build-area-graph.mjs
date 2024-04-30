import path from 'path';
import fs from 'node:fs/promises';

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

const loadFile = async (file) => {
    const contents = await fs.readFile(
        path.join(basePath, 'rooms', file),
        'utf8'
    );

    return JSON.parse(contents);
};

const rooms = {};
const roomIds = [];

const processFolder = async () => {
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

await processFolder();

const processedIds = [];
const cyNodes = [];

const processExits = (roomId, roomData) => {
    const room = rooms[roomId];

    if (!room) {
        console.log(`Room not found: ${roomId}`);
        return;
    }

    if (!room.exits) {
        console.log(`Room has no exits: ${JSON.stringify(room, null, 2)}`);
        return;
    }

    for (const exit of room.exits) {
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
        });

        if (!processedIds.includes(targetId)) {
            processedIds.push(targetId);

            const targetData = {
                data: {
                    id: targetId,
                    label: targetId.replace(`${areaId}:`, ''),
                },
                group: 'nodes',
            };

            switch (direction) {
                case 'north':
                    targetData.position = {
                        x: roomData.position.x,
                        y: roomData.position.y - 20,
                    };
                    targetData.data.layer = roomData.data.layer;
                    break;
                case 'south':
                    targetData.position = {
                        x: roomData.position.x,
                        y: roomData.position.y + 20,
                    };
                    targetData.data.layer = roomData.data.layer;
                    break;
                case 'east':
                    targetData.position = {
                        x: roomData.position.x + 20,
                        y: roomData.position.y,
                    };
                    targetData.data.layer = roomData.data.layer;
                    break;
                case 'west':
                    targetData.position = {
                        x: roomData.position.x - 20,
                        y: roomData.position.y,
                    };
                    targetData.data.layer = roomData.data.layer;
                    break;
                case 'up':
                    targetData.position = {
                        x: roomData.position.x,
                        y: roomData.position.y,
                    };
                    targetData.data.layer = roomData.data.layer + 1;
                    break;
                case 'down':
                    targetData.position = {
                        x: roomData.position.x,
                        y: roomData.position.y,
                    };
                    targetData.data.layer = roomData.data.layer - 1;
                    break;
                default:
                    break;
            }

            cyNodes.push(targetData);

            processExits(targetId, targetData);
        }
    }
};

for (const id of roomIds) {
    let isFirst = false;
    if (processedIds.includes(id)) {
        continue;
    }

    if (processedIds.length === 0) {
        isFirst = true;
    }

    processedIds.push(id);

    const roomData = {
        data: {
            id: id,
            label: id.replace(`${areaId}:`, ''),
        },
        group: 'nodes',
    };

    if (isFirst) {
        roomData.position = {
            x: 0,
            y: 0,
        };
        roomData.data.layer = 0;
    }

    cyNodes.push(roomData);

    processExits(id, roomData);
}

const areaGraph = {
    name: areaName,
    rooms: rooms,
    nodes: cyNodes,
};

await fs.writeFile(
    path.join(basePath, 'area-graph.json'),
    JSON.stringify(areaGraph, null, 4)
);

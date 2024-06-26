import type { EdgeDefinition, ElementDefinition } from 'cytoscape';
import type { PartialDeep } from 'type-fest';

import {
    AreaManager,
    Direction,
    type RoomDefinition,
    type RoomExitDefinition,
} from '../../../lib/index.js';
import type Area from '../../../lib/locations/area.js';

export type AreaGraph = ElementDefinition[];

interface RoomElementDefinition extends ElementDefinition {
    data: ElementDefinition['data'] & {
        layer: number;
    };
    position: Required<ElementDefinition>['position'];
}

type CyNode = RoomElementDefinition | EdgeDefinition;

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

export class AreaGraphGenerator {
    private readonly _area: Area;
    private readonly _areaManager: AreaManager;
    private readonly _rooms: Record<string, RoomDefinition> = {};
    private readonly _roomIds: string[] = [];
    private readonly _processedIds: string[] = [];
    private readonly _cyNodes: CyNode[] = [];

    public constructor(area: Area, manager: AreaManager) {
        this._area = area;
        this._areaManager = manager;
    }

    public generate(): AreaGraph {
        return this._processArea();
    }

    private _processArea(): AreaGraph {
        Array.from(this._area.rooms.values()).forEach((room) => {
            this._roomIds.push(`${this._area.entityReference}:${room.id}`);
            this._rooms[`${this._area.entityReference}:${room.id}`] = room.def;
        });

        this._processRooms();

        return this._cyNodes;
    }

    private _processRooms(): void {
        const id = this._roomIds[0];

        this._processedIds.push(id);

        const roomData: RoomElementDefinition = {
            data: {
                id: id,
                label: id.replace(`${this._area.entityReference}:`, ''),
                layer: 0,
            },
            group: 'nodes',
            position: {
                x: 0,
                y: 0,
            },
        };

        this._cyNodes.push(roomData);

        this._processRoom(id, roomData);
    }

    private _processRoom(
        roomId: string,
        roomData: RoomElementDefinition
    ): void {
        const room = this._rooms[roomId];

        if (!this._isFromArea(roomId) || !checkRoom(room, roomId)) {
            return;
        }

        for (const exit of room.exits) {
            const exitResult = this._processExit(roomId, exit, roomData);
            if (exitResult !== null) {
                this._processRoom(exitResult[0], exitResult[1]);
            }
        }
    }

    private _processExit(
        roomId: string,
        exit: RoomExitDefinition,
        roomData: RoomElementDefinition
    ): null | [string, RoomElementDefinition] {
        const targetId = exit.roomId;
        const direction = exit.direction;

        this._cyNodes.push({
            data: {
                source: roomId,
                target: targetId,
            },
            group: 'edges',
            selected: false,
            locked: false,
            grabbable: false,
        });

        if (!this._processedIds.includes(targetId)) {
            this._processedIds.push(targetId);

            const targetData: PartialDeep<RoomElementDefinition> = {
                data: {
                    id: targetId,
                    label: targetId.replace(
                        `${this._area.entityReference}:`,
                        ''
                    ),
                },
                group: 'nodes',
            };

            if (!this._isFromArea(targetId)) {
                targetData.data!.areaName = `to: ${this._getAreaName(targetId)}`;
                targetData.selectable = false;
                targetData.classes = 'external';
            }

            switch (direction) {
                case Direction.NORTH:
                    targetData.position = {
                        x: roomData.position.x,
                        y: roomData.position.y - 20,
                    };
                    targetData.data!.layer = roomData.data.layer;
                    targetData.data!.direction = 'north';
                    break;
                case Direction.SOUTH:
                    targetData.position = {
                        x: roomData.position.x,
                        y: roomData.position.y + 20,
                    };
                    targetData.data!.layer = roomData.data.layer;
                    targetData.data!.direction = 'south';
                    break;
                case Direction.EAST:
                    targetData.position = {
                        x: roomData.position.x + 20,
                        y: roomData.position.y,
                    };
                    targetData.data!.layer = roomData.data.layer;
                    targetData.data!.direction = 'east';
                    break;
                case Direction.WEST:
                    targetData.position = {
                        x: roomData.position.x - 20,
                        y: roomData.position.y,
                    };
                    targetData.data!.layer = roomData.data.layer;
                    targetData.data!.direction = 'west';
                    break;
                case Direction.UP:
                    targetData.position = {
                        x: roomData.position.x,
                        y: roomData.position.y,
                    };
                    targetData.data!.layer = roomData.data.layer + 1;
                    targetData.data!.direction = 'up';
                    break;
                case Direction.DOWN:
                    targetData.position = {
                        x: roomData.position.x,
                        y: roomData.position.y,
                    };
                    targetData.data!.layer = roomData.data.layer - 1;
                    targetData.data!.direction = 'down';
                    break;
                default:
                    break;
            }

            this._cyNodes.push(targetData as RoomElementDefinition);

            return [targetId, targetData as RoomElementDefinition];
        }

        return null;
    }

    private _isFromArea(roomId: string): boolean {
        return roomId.startsWith(this._area.entityReference);
    }

    private _getAreaName(roomId: string): string {
        const areaRef = roomId.split(':')[0];
        const area = this._areaManager.getArea(areaRef);

        if (area === null) {
            return 'Unknown area';
        }

        return area.name;
    }
}

export default AreaGraphGenerator;

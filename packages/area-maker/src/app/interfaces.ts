import type {RoomDefinition, RoomExitDefinition} from '@adamantiamud/core';
import type {PartialDeep} from 'type-fest';

export enum ExitDirection {
    NORTH = 'north',
    EAST = 'east',
    SOUTH = 'south',
    WEST = 'west',
}

export interface Position {
    x: number;
    y: number;
}

export interface AugmentedRoomExitDef extends RoomExitDefinition {
    roomLinkId: string;
}

export interface AugmentedRoomDef extends RoomDefinition {
    exits?: AugmentedRoomExitDef[];
}

export interface RoomNode {
    id: string;
    roomDef: AugmentedRoomDef;
    color: string;
    coords: Position;
    lastUpdate: number;
}

export interface RoomLinkNode {
    id: string;
    fromRoom: string;
    fromSide: ExitDirection;
    toRoom: string;
    oneWay?: boolean;
}

export type AddRoomFunc = (coords: Position) => void;
export type AddRoomLinkFunc = (fromRoom: string, fromSide: ExitDirection) => string;
export type RemoveRoomFunc = (roomId: string) => void;
export type RemoveRoomLinkFunc = (roomLinkId: string) => void;
export type UpdateRoomFunc = (room: RoomNode) => void;
export type UpdateRoomLinkFunc = (roomLink: RoomLinkNode) => void;
export type UpdateRoomByIdFunc = (roomId: string, data: PartialDeep<RoomNode>) => void;
export type UpdateRoomsFunc = (rooms: RoomNode[]) => void;

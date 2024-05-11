import path from 'node:path';

import type { BundleEntityManager } from '../util/bundle-entity-manager.js';

import type Room from './room.js';

/**
 * Keeps track of all the individual rooms in the game
 */
export class RoomManager implements BundleEntityManager<Room> {
    private readonly _rooms: Map<string, Room> = new Map<string, Room>();
    private readonly _bundlePaths: Map<string, string> = new Map<
        string,
        string
    >();

    public getAll(): Map<string, Room> {
        return this._rooms;
    }

    public add(ref: string, room: Room, definitionFileUri: string): void {
        this._rooms.set(ref, room);
        this._bundlePaths.set(ref, definitionFileUri);
    }

    public get(ref: string): Room | null {
        return this._rooms.get(ref) ?? null;
    }

    public getPath(ref: string): string | null {
        const bundlePath = this._bundlePaths.get(ref);
        if (bundlePath === undefined) {
            return null;
        }

        const room = this._rooms.get(ref)!;
        const { area } = room;

        return path.join(
            bundlePath,
            'areas',
            area.entityReference,
            'rooms',
            `${room.id}.json`
        );
    }

    public remove(ref: string): void {
        this._rooms.delete(ref);
        this._bundlePaths.delete(ref);
    }

    public size(): number {
        return this._rooms.size;
    }
}

export default RoomManager;

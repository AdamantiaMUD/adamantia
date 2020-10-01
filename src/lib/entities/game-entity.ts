import cloneFactory from 'rfdc';
import get from 'lodash.get';
import set from 'lodash.set';

import MudEventEmitter from '../events/mud-event-emitter';
import {MetadataUpdatedEvent} from '../data/events';

import type GameEntityInterface from './game-entity-interface';
import type GameStateData from '../game-state-data';
import type Metadatable from '../data/metadatable';
import type Serializable from '../data/serializable';
import type SimpleMap from '../util/simple-map';

const clone = cloneFactory();

export interface GameEntityDefinition {
    metadata?: SimpleMap;
}

export interface SerializedGameEntity extends SimpleMap {
    entityReference: string | null;
    metadata: SimpleMap | null;
}

export class GameEntity extends MudEventEmitter implements Metadatable, Serializable, GameEntityInterface {
    /* eslint-disable @typescript-eslint/lines-between-class-members */
    private _metadata: SimpleMap = {};
    protected _state: GameStateData | null;
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    public __pruned: boolean = false;
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    public __hydrated: boolean = false;
    public entityReference: string | null = '';
    /* eslint-enable @typescript-eslint/lines-between-class-members */

    public constructor(def?: GameEntityDefinition) {
        super();

        this._metadata = clone(def?.metadata ?? {});
    }

    public deserialize(data?: SerializedGameEntity, state: GameStateData | null = null): void {
        this.entityReference = data?.entityReference ?? '';
        this._metadata = clone(data?.metadata ?? {});
        this._state = state;
    }

    /*
     * Get metadata by any notation supported by lodash.get
     */
    public getMeta<T = unknown>(key: string): T | undefined {
        const meta: unknown = get(this._metadata, key);

        if (typeof meta === 'undefined') {
            return undefined;
        }

        return meta as T;
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public hydrate(state: GameStateData): void {
        // no-op
    }

    public serialize(): SerializedGameEntity {
        const meta = clone(this._metadata);

        delete meta.class;
        delete meta.lastCommandTime;

        const data: SerializedGameEntity = {
            entityReference: null,
            metadata: meta,
        };

        if (this.entityReference !== '') {
            data.entityReference = this.entityReference;
        }

        return data;
    }

    /*
     * Set a metadata value.
     *
     * @param {string} key   Key to set. Supports dot notation e.g., `"foo.bar"`
     * @param {*}      newValue Value must be JSON.stringify-able
     * @fires MetadataUpdatedEvent
     */
    public setMeta<T = unknown>(key: string, newValue: T): void {
        const oldValue = get(this._metadata, key);

        set(this._metadata, key, newValue);

        /**
         * @event Metadatable#metadataUpdate
         * @param {string} key
         * @param {*} newValue
         * @param {*} oldValue
         */
        this.dispatch(new MetadataUpdatedEvent({key, newValue, oldValue}));
    }
}

export default GameEntity;

import EventEmitter from 'events';
import Logger from '../util/logger';

import {isIterable} from '../util/objects';

export class EventManager {
    /**
     * key: string - The name of the event
     * value: Set<Function> - The set of listeners to call when the event fires
     */
    private _events: Map<string, Set<Function>> = new Map();

    // public get events(): Map<string, Set<Function>> {
    //     return this._events;
    // }

    public get size(): number {
        return this._events.size;
    }

    /**
     * Add a new listener for the given event. If no listeners have been
     * previously added for the event, it is first initialized with an empty set.
     */
    public add(name: string, listener: Function): void {
        if (!this._events.has(name)) {
            this._events.set(name, new Set());
        }

        this._events.get(name).add(listener);
    }

    /**
     * Attach all currently added events to the given emitter
     */
    public attach(emitter: EventEmitter, config?: any): void {
        for (const [event, listeners] of this._events) {
            for (const listener of listeners) {
                if (config) {
                    emitter.on(event, (...args: any[]) => listener(emitter, config, ...args));
                }
                else {
                    emitter.on(event, (...args: any[]) => listener(emitter, ...args));
                }
            }
        }
    }

    /**
     * Remove all listeners for a given emitter or only those for the given events
     * If no events are given it will remove all listeners from all events defined
     * in this manager.
     *
     * Warning: This will remove _all_ listeners for a given event list, this includes
     * listeners not in this manager but attached to the same event
     */
    public detach(emitter: EventEmitter, eventNames: string | string[] = null): void {
        let events: string[] = [];

        if (typeof eventNames === 'string') {
            events = [eventNames];
        }
        else if (Array.isArray(eventNames)) {
            events = eventNames;
        }
        else if (!events) {
            events = [...this._events.keys()];
        }
        else if (!isIterable(events)) {
            throw new TypeError('events list passed to detach() is not iterable');
        }

        for (const event of events) {
            emitter.removeAllListeners(event);
        }
    }

    /**
     * Fetch all listeners for a given event
     */
    public get(name: string): Set<Function> {
        if (!this._events.has(name)) {
            return new Set();
        }

        return this._events.get(name);
    }
}

export default EventManager;

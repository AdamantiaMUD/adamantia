import Character, {SerializedCharacter} from '../entities/character';
import CommandQueue, {ExecutableCommand} from '../commands/command-queue';
import GameState from '../game-state';
import PlayerRole from './player-role';
import Room from '../locations/room';
import {Broadcastable} from '../communication/broadcast';
import {noop} from '../util/functions';

export interface PromptDefinition {
    removeOnRender: boolean;
    renderer: () => string;
}

export interface SerializedPlayer extends SerializedCharacter {
    experience: number;
    prompt: string;
    role: PlayerRole;
}

export class Player extends Character implements Broadcastable {
    private readonly _commandQueue: CommandQueue = new CommandQueue();
    private _experience: number = 0;
    private _prompt: string = '> ';
    private _role: PlayerRole = PlayerRole.PLAYER;

    public extraPrompts: Map<string, PromptDefinition> = new Map();

    public get commandQueue(): CommandQueue {
        return this._commandQueue;
    }

    public get experience(): number {
        return this._experience;
    }

    public get prompt(): string {
        return this._prompt;
    }

    public get role(): PlayerRole {
        return this._role;
    }

    public addExperience(exp: number): void {
        this._experience += exp;
    }

    /**
     * Add a line of text to be displayed immediately after the prompt when the
     * prompt is displayed
     */
    public addPrompt(id: string, renderer: () => string, removeOnRender: boolean = false): void {
        this.extraPrompts.set(id, {removeOnRender, renderer});
    }

    public deserialize(data: SerializedPlayer, state: GameState): void {
        super.deserialize(data, state);

        this._experience = data.experience;
        this._prompt = data.prompt;
        this._role = data.role;
    }

    public getBroadcastTargets(): Player[] {
        return [this];
    }

    public hasPrompt(id: string): boolean {
        return this.extraPrompts.has(id);
    }

    /**
     * Convert prompt tokens into actual data
     */
    public interpolatePrompt(promptStr: string, extraData = {}): string {
        const attributeData = {};

        // for (const attr of this.getAttributeNames()) {
        //     attributeData[attr] = {
        //         current: this.getAttribute(attr),
        //         max: this.getMaxAttribute(attr),
        //         base: this.getBaseAttribute(attr),
        //     };
        // }

        const promptData = Object.assign(attributeData, extraData);

        const expr = /%([a-z.]+)%/u;

        let prompt = promptStr,
            matches = prompt.match(expr);

        while (matches !== null) {
            const token = matches[1];

            let promptValue = token
                .split('.')
                .reduce((obj, index) => obj && obj[index], promptData);

            if (promptValue === null || promptValue === undefined) {
                promptValue = 'invalid-token';
            }

            prompt = prompt.replace(matches[0], promptValue);
            matches = prompt.match(expr);
        }

        return prompt;
    }

    public levelUp(): void {
        this._level += 1;
        this._experience = 0;
    }

    /**
     * Move the player to the given room, emitting events appropriately
     *
     * @fires Room#playerLeave
     * @fires Room#playerEnter
     * @fires Player#enterRoom
     */
    public moveTo(nextRoom: Room, onMoved = noop): void {
        const prevRoom = this.room;

        if (this.room && this.room !== nextRoom) {
            /**
             * @event Room#playerLeave
             * @param {Player} player
             * @param {Room} nextRoom
             */
            this.room.emit('playerLeave', this, nextRoom);
            this.room.removePlayer(this);
        }

        this.room = nextRoom;
        nextRoom.addPlayer(this);

        onMoved();

        /**
         * @event Room#playerEnter
         * @param {Player} player
         * @param {Room} prevRoom
         */
        nextRoom.emit('playerEnter', this, prevRoom);

        /**
         * @event Player#enterRoom
         * @param {Room} room
         */
        this.emit('enterRoom', nextRoom);
    }

    /**
     * @see CommandQueue::enqueue
     */
    public queueCommand(command: ExecutableCommand, lag: number): void {
        const index = this.commandQueue.enqueue(command, lag);

        this.emit('commandQueued', index);
    }

    public removePrompt(id: string): void {
        this.extraPrompts.delete(id);
    }

    public save(callback?: Function): void {
        if (!this.__hydrated) {
            return;
        }

        this.emit('save', callback);
    }

    public serialize(): SerializedPlayer {
        return {
            ...super.serialize(),

            experience: this._experience,
            prompt: this._prompt,
            role: this._role,
        };
    }
}

export default Player;

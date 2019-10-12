import CharacterAttributes, {SerializedCharacterAttributes} from '../attributes/character-attributes';
import Effect from '../effects/effect';
import EffectList from '../effects/effect-list';
import GameEntity, {SerializedGameEntity} from './game-entity';
import GameState from '../game-state';
import Inventory from '../equipment/inventory';
import Item from '../equipment/item';
import Room from '../locations/room';
import Serializable from '../data/serializable';
import TransportStream from '../communication/transport-stream';
import CharacterCombat from '../combat/character-combat';

export interface SerializedCharacter extends SerializedGameEntity {
    attributes: SerializedCharacterAttributes;
    level: number;
    name: string;
    room: string;
}

export class Character extends GameEntity implements Serializable {
    protected readonly _attributes: CharacterAttributes;
    protected readonly _combat: CharacterCombat;
    protected readonly _effects: EffectList;
    protected _inventory: Inventory;
    protected _level: number = 1;
    public name: string = '';
    public room: Room = null;
    public socket: TransportStream<any> = null;

    constructor() {
        super();

        this._attributes = new CharacterAttributes(this);
        this._combat = new CharacterCombat(this);
        this._effects = new EffectList(this);
    }

    public get attributes(): CharacterAttributes {
        return this._attributes;
    }

    public get combat(): CharacterCombat {
        return this._combat;
    }

    public get effects(): EffectList {
        return this._effects;
    }

    public get inventory(): Inventory {
        return this._inventory;
    }

    public get level(): number {
        return this._level;
    }

    public addEffect(effect: Effect): boolean {
        return this._effects.add(effect);
    }

    public deserialize(data: SerializedCharacter, state: GameState): void {
        super.deserialize(data);

        this._attributes.deserialize(data.attributes ?? {}, state);

        this._level = data.level;
        this.name = data.name;

        if (data.room) {
            this.room = state.roomManager.getRoom(data.room);
        }
        else {
            const startingRoom = state.config.get('startingRoom');
            this.room = state.roomManager.getRoom(startingRoom);
        }
    }

    /**
     * Get the current value of an attribute (base modified by delta)
     */
    public getAttribute(attr: string, defaultValue: number = null): number {
        if (!this._attributes.has(attr)) {
            if (defaultValue !== null) {
                return defaultValue;
            }

            throw new RangeError(`Character does not have attribute [${attr}]`);
        }

        return this.getMaxAttribute(attr) + this._attributes.get(attr).delta;
    }

    public getAttributeNames(): IterableIterator<string> {
        return this._attributes.getAttributeNames();
    }

    /**
     * Get the base value for a given attribute
     */
    public getBaseAttribute(attr: string): number {
        const att = this._attributes.get(attr);

        return att && att.base;
    }

    /**
     * Get current maximum value of attribute (as modified by effects.)
     */
    public getMaxAttribute(attr: string): number {
        if (!this._attributes.has(attr)) {
            throw new RangeError(`Character does not have attribute [${attr}]`);
        }

        const attribute = this._attributes.get(attr);
        // const currentVal = this.effects.evaluateAttribute(attribute);
        const currentVal = attribute.base ?? 0;

        if (!attribute.formula) {
            return currentVal;
        }

        const {formula} = attribute;

        const requiredValues = formula.requires.map(att => this.getMaxAttribute(att));

        /* eslint-disable-next-line no-useless-call */
        return formula.evaluate.apply(formula, [
            attribute,
            this,
            currentVal,
            ...requiredValues,
        ]);
    }

    public hasEffectType(type: string): boolean {
        return this._effects.hasEffectType(type);
    }

    public removeEffect(effect: Effect): void {
        this._effects.remove(effect);
    }

    /**
     * Remove an item from the character's inventory. Warning: This does not automatically place the
     * item in any particular place. You will need to manually add it to the room or another
     * character's inventory
     */
    public removeItem(item: Item): void {
        this._inventory.removeItem(item);

        /*
         * if we removed the last item unset the inventory
         * This ensures that when it's reloaded it won't try to set
         * its default inventory. Instead it will persist the fact
         * that all the items were removed from it
         */
        if (this._inventory.size === 0) {
            this._inventory = null;
        }

        item.carriedBy = null;
    }

    public serialize(): SerializedCharacter {
        return {
            ...super.serialize(),

            attributes: this._attributes.serialize(),
            level: this._level,
            name: this.name,
            room: this.room.entityReference,
        };
    }
}

export default Character;

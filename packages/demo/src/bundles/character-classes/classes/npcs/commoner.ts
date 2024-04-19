import type { Character, GameStateData, NpcClass } from '@adamantiamud/core';

export class Commoner implements NpcClass {
    /* eslint-disable @typescript-eslint/lines-between-class-members */
    public readonly name: string = 'Commoner';
    public readonly description: string = '';
    public readonly abilityTable: NpcClass['abilityTable'] = {};
    /* eslint-enable @typescript-eslint/lines-between-class-members */

    public setup(state: GameStateData, character: Character): void {}
}

export default Commoner;

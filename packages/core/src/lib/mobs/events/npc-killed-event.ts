import type Character from '../../characters/character.js';
import MudEvent from '../../events/mud-event.js';

export interface NpcKilledPayload {
    killer?: Character | null;
}

export class NpcKilledEvent extends MudEvent<NpcKilledPayload> {
    /* eslint-disable @typescript-eslint/lines-between-class-members */
    public NAME: string = 'npc-killed';
    public killer?: Character | null;
    /* eslint-enable @typescript-eslint/lines-between-class-members */
}

export default NpcKilledEvent;

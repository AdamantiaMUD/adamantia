import type Character from '../../characters/character.js';
import MudEvent from '../../events/mud-event.js';

export interface PlayerKilledPayload {
    killer?: Character | null;
}

export class PlayerKilledEvent extends MudEvent<PlayerKilledPayload> {
    /* eslint-disable @typescript-eslint/lines-between-class-members */
    public NAME: string = 'player-killed';
    public killer?: Character | null;
    /* eslint-enable @typescript-eslint/lines-between-class-members */
}

export default PlayerKilledEvent;

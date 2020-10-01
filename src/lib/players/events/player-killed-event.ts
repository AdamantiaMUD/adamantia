import MudEvent from '../../events/mud-event';

import type Character from '../../characters/character';

export interface PlayerKilledPayload {
    killer?: Character;
}

export class PlayerKilledEvent extends MudEvent<PlayerKilledPayload> {
    /* eslint-disable @typescript-eslint/lines-between-class-members */
    public NAME: string = 'player-killed';
    public killer?: Character;
    /* eslint-enable @typescript-eslint/lines-between-class-members */
}

export default PlayerKilledEvent;

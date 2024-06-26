import type Player from '../players/player.js';

import Party from './party.js';

/**
 * Keeps track of active in game parties and is used to create new parties
 */
export class PartyManager extends Set<Party> {
    /**
     * Create a new party from with a given leader
     */
    public create(leader: Player): void {
        const party = new Party(leader);

        this.add(party);
    }

    public disband(party: Party): void {
        party.disband();

        this.delete(party);
    }
}

export default PartyManager;

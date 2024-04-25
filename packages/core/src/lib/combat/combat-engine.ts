import type Character from '../characters/character.js';
import type GameStateData from '../game-state-data.js';
import type Player from '../players/player.js';

export abstract class CombatEngine {
    public abstract buildPrompt(player: Player): string;
    public abstract chooseCombatant(attacker: Character): Character | null;
    public abstract findCombatant(
        attacker: Player,
        search: string
    ): Character | null;
    public abstract handleDeath(
        state: GameStateData,
        victim: Character,
        killer?: Character | null
    ): void;
    public abstract startRegeneration(
        state: GameStateData,
        combatant: Character
    ): void;
    public abstract updateRound(
        state: GameStateData,
        attacker: Character
    ): boolean;
}

export default CombatEngine;

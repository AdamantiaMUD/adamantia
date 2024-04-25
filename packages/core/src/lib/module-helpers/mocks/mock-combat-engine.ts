import GameStateData from 'src/lib/game-state-data.js';
import { Character, CombatEngine, Player } from 'src/lib/index.js';

export class MockCombatEngine extends CombatEngine {
    public buildPrompt(player: Player): string {
        return '';
    }

    public chooseCombatant(attacker: Character): Character | null {
        return null;
    }

    public findCombatant(attacker: Player, search: string): Character | null {
        return null;
    }

    public handleDeath(
        state: GameStateData,
        victim: Character,
        killer?: Character | null | undefined
    ): void {}

    public startRegeneration(
        state: GameStateData,
        combatant: Character
    ): void {}

    public updateRound(state: GameStateData, attacker: Character): boolean {
        return true;
    }
}

export default MockCombatEngine;

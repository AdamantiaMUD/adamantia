/* eslint-disable no-process-exit */
import PlayerRole from '../../../lib/players/player-role';
import {sayAt} from '../../../lib/communication/broadcast';

import type CommandDefinitionFactory from '../../../lib/commands/command-definition-factory';
import type CommandExecutable from '../../../lib/commands/command-executable';
import type GameStateData from '../../../lib/game-state-data';
import type Player from '../../../lib/players/player';

/**
 * Shut down the MUD from within the game.
 */
export const cmd: CommandDefinitionFactory = {
    name: 'shutdown',
    requiredRole: PlayerRole.ADMIN,
    command: (state: GameStateData): CommandExecutable => async (rawArgs: string | null, player: Player): Promise<void> => {
        const args = rawArgs?.trim() ?? '';

        if (args === 'now') {
            sayAt(state.playerManager, '{yellow.bold Game is shutting down now!}');
            await state.playerManager.saveAll();

            process.exit();

            return;
        }

        if (args.length === 0 || args !== 'sure') {
            sayAt(player, 'You must confirm the shutdown with "shutdown sure" or force immediate shutdown with "shutdown now"');

            return;
        }

        sayAt(state.playerManager, '{yellow.bold Game will shut down in 30 seconds.}');

        setTimeout(() => {
            sayAt(state.playerManager, '{yellow.bold Game is shutting down now!}');

            /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
            state.playerManager.saveAll().then(() => process.exit());
        }, 30000);
    },
};

export default cmd;

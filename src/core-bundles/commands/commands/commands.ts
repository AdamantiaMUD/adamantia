import {sayAt, sayAtColumns} from '../../../lib/communication/broadcast';

import type CommandDefinitionFactory from '../../../lib/commands/command-definition-factory';
import type CommandExecutable from '../../../lib/commands/command-executable';
import type GameStateData from '../../../lib/game-state-data';
import type Player from '../../../lib/players/player';

export const cmd: CommandDefinitionFactory = {
    name: 'commands',
    aliases: ['channels'],
    command: (state: GameStateData): CommandExecutable => (args: string, player: Player): void => {
        // print standard commands
        sayAt(player, '<b><white>                  Commands</b></white>');
        /* eslint-disable-next-line max-len */
        sayAt(player, '<b><white>===============================================</b></white>');

        const commands: string[] = [];

        for (const [name, command] of state.commandManager.commands) {
            if (player.role >= command.requiredRole) {
                commands.push(name);
            }
        }

        commands.sort((cmd1: string, cmd2: string) => cmd1.localeCompare(cmd2));
        sayAtColumns(player, commands, 4);

        // channels
        sayAt(player);
        sayAt(player, '<b><white>                  Channels</b></white>');
        /* eslint-disable-next-line max-len */
        sayAt(player, '<b><white>===============================================</b></white>');

        const channelCommands: string[] = [];

        for (const [name] of state.channelManager.channels) {
            channelCommands.push(name);
        }

        channelCommands.sort((cmd1: string, cmd2: string) => cmd1.localeCompare(cmd2));
        sayAtColumns(player, channelCommands, 4);

        // end with a line break
        sayAt(player, '');
    },
};

export default cmd;

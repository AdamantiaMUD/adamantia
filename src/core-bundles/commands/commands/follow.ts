import ArgParser from '../../../lib/commands/arg-parser';
import Broadcast from '../../../lib/communication/broadcast';
import {hasValue} from '../../../lib/util/functions';
import {isNpc} from '../../../lib/util/characters';

import type CommandDefinitionFactory from '../../../lib/commands/command-definition-factory';
import type CommandExecutable from '../../../lib/commands/command-executable';
import type Player from '../../../lib/players/player';

const {sayAt} = Broadcast;

const follow: CommandDefinitionFactory = {
    name: 'follow',
    command: (): CommandExecutable => (rawArgs: string | null, player: Player): void => {
        const args = rawArgs?.trim() ?? '';

        if (args.length === 0) {
            sayAt(player, 'Follow whom?');

            return;
        }

        let target = ArgParser.parseDot(args, Array.from(player.room?.players ?? new Set<Player>()));

        if (!hasValue(target)) {
            if (args === 'self') {
                target = player;
            }
            else {
                sayAt(player, "You can't find anyone named that.");

                return;
            }
        }

        // follow self un-follows the person they're currently following
        if (target === player) {
            if (player.following === null) {
                sayAt(player, "You can't follow yourself...");
            }
            else {
                if (!isNpc(player.following)) {
                    sayAt(player.following as Player, `${player.name} stops following you.`);
                }

                sayAt(player, `You stop following ${player.following.name}.`);

                player.unfollow();
            }

            return;
        }

        sayAt(player, `You start following ${target.name}.`);

        if (!isNpc(target)) {
            sayAt(target, `${player.name} starts following you.`);
        }

        player.follow(target);
    },
};

export default follow;

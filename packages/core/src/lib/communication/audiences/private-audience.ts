import type Player from '../../players/player.js';
import { hasValue } from '../../util/functions.js';

import ChannelAudience from './channel-audience.js';

/**
 * Audience class representing a specific targeted player.
 * Example: `tell` command or `whisper` command.
 */
export class PrivateAudience extends ChannelAudience {
    /**
     * Strips target name from message
     */
    public alterMessage(message: string): string {
        return message.split(' ').slice(1).join(' ');
    }

    public getBroadcastTargets(): Player[] {
        const targetPlayerName = this.message.split(' ')[0];
        const targetPlayer =
            this.state?.playerManager.getPlayer(targetPlayerName);

        if (hasValue(targetPlayer)) {
            return [targetPlayer];
        }

        return [];
    }
}

export default PrivateAudience;

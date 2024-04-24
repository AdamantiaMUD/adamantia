import type PlayerEventListenerDefinition from '../../../lib/events/player-event-listener-definition.js';
import type PlayerEventListener from '../../../lib/events/player-event-listener.js';
import type Player from '../../../lib/players/player.js';
import {
    QuestProgressEvent,
    type QuestProgressPayload,
} from '../../../lib/quests/events/index.js';

export const evt: PlayerEventListenerDefinition<QuestProgressPayload> = {
    name: QuestProgressEvent.getName(),
    listener:
        (): PlayerEventListener<QuestProgressPayload> =>
        (player: Player): void => {
            player.socket?.command(
                'sendData',
                'quests',
                player.questTracker.serialize().active
            );
        },
};

export default evt;

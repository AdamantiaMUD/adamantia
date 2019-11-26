import Player from '../../../lib/players/player';
import {MudEventListener, MudEventListenerFactory} from '../../../lib/events/mud-event';
import {QuestProgressEvent, QuestProgressPayload} from '../../../lib/quests/quest-events';

export const evt: MudEventListenerFactory<QuestProgressPayload> = {
    name: QuestProgressEvent.getName(),
    listener: (): MudEventListener<QuestProgressPayload> =>

        /**
         * @listens Player#questProgress
         */
        (player: Player) => {
            player.socket.command(
                'sendData',
                'quests',
                player.questTracker.serialize().active
            );
        }
    ,
};

export default evt;

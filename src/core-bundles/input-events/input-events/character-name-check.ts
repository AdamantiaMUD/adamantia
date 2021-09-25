import type {EventEmitter} from 'events';

import {CharacterNameCheckEvent, CreateCharacterEvent, FinishCharacterEvent} from '../lib/events';

import type StreamEventListener from '../../../lib/events/stream-event-listener';
import type StreamEventListenerFactory from '../../../lib/events/stream-event-listener-factory';
import type TransportStream from '../../../lib/communication/transport-stream';
import type {CharacterNameCheckPayload} from '../lib/events';

/**
 * Confirm new player name
 */
export const evt: StreamEventListenerFactory<CharacterNameCheckPayload> = {
    name: CharacterNameCheckEvent.getName(),
    listener: (): StreamEventListener<CharacterNameCheckPayload> => (
        stream: TransportStream<EventEmitter>,
        args: CharacterNameCheckPayload
    ): void => {
        stream.write(`{bold ${args.name} doesn't exist, would you like to create it?} {cyan [y/n]} `);

        stream.socket.once('data', (buf: Buffer) => {
            stream.write('');

            const confirmation = buf.toString()
                .trim()
                .toLowerCase();

            if (!(/[yn]/u).test(confirmation)) {
                stream.dispatch(new CharacterNameCheckEvent(args));

                return;
            }

            if (confirmation === 'n') {
                stream.write("Let's try again...");

                stream.dispatch(new CreateCharacterEvent({account: args.account}));

                return;
            }

            stream.dispatch(new FinishCharacterEvent(args));
        });
    },
};

export default evt;

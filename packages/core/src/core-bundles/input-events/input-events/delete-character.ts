import type { EventEmitter } from 'events';

import Logger from '../../../lib/common/logger.js';
import type TransportStream from '../../../lib/communication/transport-stream.js';
import type InputMenuOption from '../../../lib/events/input-menu-option.js';
import type StreamEventListenerFactory from '../../../lib/events/stream-event-listener-factory.js';
import type StreamEventListener from '../../../lib/events/stream-event-listener.js';
import type CharacterBrief from '../../../lib/players/character-brief.js';
import { hasValue } from '../../../lib/util/functions.js';
import {
    ChooseCharacterEvent,
    DeleteCharacterEvent,
    type DeleteCharacterPayload,
} from '../lib/events/index.js';

/**
 * Delete character event
 */
export const evt: StreamEventListenerFactory<DeleteCharacterPayload> = {
    name: DeleteCharacterEvent.getName(),
    listener:
        (): StreamEventListener<DeleteCharacterPayload> =>
        (
            stream: TransportStream<EventEmitter>,
            { account }: DeleteCharacterPayload
        ): void => {
            stream.write('------------------------------');
            stream.write('|      Delete a Character');
            stream.write('------------------------------');

            const characters = account.characters.filter(
                (char: CharacterBrief) => !char.isDeleted
            );

            const options: InputMenuOption[] = [];

            characters.forEach((char: CharacterBrief) => {
                options.push({
                    display: `Delete {bold ${char.username}}`,
                    onSelect: () => {
                        stream.write(
                            `{bold Are you sure you want to delete {yellow ${char.username}}?} {cyan [Y/n]} `
                        );

                        stream.socket.once('data', (buf: Buffer) => {
                            stream.write('');

                            const confirmation = buf
                                .toString()
                                .trim()
                                .toLowerCase();

                            if (!/[yn]/u.test(confirmation)) {
                                stream.write('{bold Invalid Option}');

                                stream.dispatch(
                                    new ChooseCharacterEvent({ account })
                                );

                                return;
                            }

                            if (confirmation === 'n') {
                                stream.write('No one was deleted...');

                                stream.dispatch(
                                    new ChooseCharacterEvent({ account })
                                );

                                return;
                            }

                            stream.write(`Deleting ${char.username}`);
                            account.deleteCharacter(char.username);
                            stream.write('Character deleted.');

                            stream.dispatch(
                                new ChooseCharacterEvent({ account })
                            );
                        });
                    },
                });
            });

            options.push({ display: '' });

            options.push({
                display: 'Go back to main menu',
                onSelect: () => {
                    stream.dispatch(new ChooseCharacterEvent({ account }));
                },
            });

            let optionI = 0;

            options.forEach((opt: InputMenuOption) => {
                if (hasValue(opt.onSelect)) {
                    optionI += 1;
                    stream.write(`| {cyan [${optionI}]} ${opt.display}`);
                } else {
                    stream.write(`| {bold ${opt.display}}`);
                }
            });

            stream.write('|\n`-> ');

            stream.socket.once('data', (buf: Buffer) => {
                const choice = parseInt(buf.toString().trim(), 10) - 1;

                if (isNaN(choice)) {
                    stream.dispatch(new ChooseCharacterEvent({ account }));

                    return;
                }

                const selection = options.filter((opt: InputMenuOption) =>
                    Boolean(opt.onSelect)
                )[choice];

                if (hasValue(selection)) {
                    Logger.log(`Selected ${selection.display}`);

                    /* eslint-disable-next-line no-void */
                    void selection.onSelect!();

                    return;
                }

                stream.dispatch(new ChooseCharacterEvent({ account }));
            });
        },
};

export default evt;

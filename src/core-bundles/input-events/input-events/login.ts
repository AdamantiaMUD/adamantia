import {EventEmitter} from 'events';

import Account from '../../../lib/players/account';
import GameState from '../../../lib/game-state';
import Logger from '../../../lib/util/logger';
import TransportStream from '../../../lib/communication/transport-stream';
import {MudEventListener, MudEventListenerFactory} from '../../../lib/events/mud-event';
import {validateAccountName} from '../../../lib/util/player';

export const evt: MudEventListenerFactory<> = {
export const login: InputEventListenerDefinition = {
    event: (state: GameState) => (socket: TransportStream<EventEmitter>) => {
        socket.write('Welcome, what is your username? ');

        socket.once('data', async (buf: Buffer) => {
            const name = buf.toString().trim().toLowerCase();

            try {
                validateAccountName(state.config, name);
            }
            catch (err) {
                socket.write(`${err.message}\r\n`);

                socket.emit('login');

                return;
            }

            let account: Account = null;

            try {
                account = await state.accountManager.loadAccount(name);
            }
            catch (e) {
                Logger.error(e.message);
            }

            if (!account) {
                Logger.error(`No account found as ${name}.`);

                socket.emit('create-account', name);

                return;
            }

            if (account.banned) {
                socket.write('This account has been banned.\r\n');
                socket.end();

                return;
            }

            if (account.deleted) {
                socket.write('This account has been deleted.\r\n');
                socket.end();

                return;
            }

            socket.emit('password', account);
        });
    },
};

export default login;

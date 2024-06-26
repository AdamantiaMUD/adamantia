import { type Server, type Socket, createServer } from 'net';

import type AdamantiaSocket from '../../../lib/communication/adamantia-socket.js';
import { cast } from '../../../lib/util/functions.js';

class TelnetServer {
    public netServer: Server;

    /**
     * @param {function} listener   connected callback
     * @param {Object}   options options for the stream @see TelnetSocket
     */
    public constructor(
        listener: (socket: AdamantiaSocket) => void,
        options: { allowHalfOpen?: boolean; pauseOnConnect?: boolean } = {}
    ) {
        this.netServer = createServer(options, (socket: Socket) => {
            const mySocket = cast<AdamantiaSocket>(socket);

            /* eslint-disable-next-line no-param-reassign */
            mySocket.fresh = true;
            listener(mySocket);
        });
    }
}

export default TelnetServer;

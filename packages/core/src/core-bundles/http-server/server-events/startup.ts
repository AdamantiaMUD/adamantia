import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify from 'fastify';

import Logger from '../../../lib/common/logger.js';
import type MudEventListenerDefinition from '../../../lib/events/mud-event-listener-definition.js';
import type { StatefulListenerFactory } from '../../../lib/events/mud-event-listener-factory.js';
import type MudEventListener from '../../../lib/events/mud-event-listener.js';
import {
    GameServerStartupEvent,
    type GameServerStartupPayload,
} from '../../../lib/game-server/events/index.js';
import type GameState from '../../../lib/game-state.js';
import mudStatePlugin from '../decorators/mud-state-decorator.js';
import routes from '../routes/index.js';

const DEFAULT_HTTP_PORT = 4001;

export const evt: MudEventListenerDefinition<[GameServerStartupPayload]> = {
    name: GameServerStartupEvent.getName(),
    listener: ((
            state: GameState
        ): MudEventListener<[GameServerStartupPayload]> =>
        async (): Promise<void> => {
            const port = state.config.get('ports.http', DEFAULT_HTTP_PORT);

            const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

            // Register MUD state plugin
            await server.register(mudStatePlugin, { mud: state });

            // Register routes
            await server.register(routes, { prefix: '/' });

            // Run the server!
            server.listen(
                { port: port as number, host: '0.0.0.0' },
                (err: Error | null, address: string) => {
                    if (err !== null) {
                        server.log.error(err);
                        process.exit(1);
                    }
                }
            );

            Logger.info(`HTTP server started on port: ${port}...`);
        }) as StatefulListenerFactory<[GameServerStartupPayload]>,
};

export default evt;

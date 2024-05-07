import makePlugin from 'fastify-plugin';

import type GameState from '../../../lib/game-state';

interface MudStatePluginOptions {
    mud: GameState;
}

const plugin = makePlugin<MudStatePluginOptions>((fastify, opts, done) => {
    fastify.decorate('mud', opts.mud);

    done();
});

export default plugin;

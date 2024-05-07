import type GameState from '../../lib/game-state.js';

declare module 'fastify' {
    interface FastifyInstance {
        mud: GameState;
    }
}

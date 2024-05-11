import type { IncomingMessage, ServerResponse } from 'node:http';

import type { FastifyReply, FastifyRequest, RawServerDefault } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';

export type AdamantiaReply<
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
> = FastifyReply<
    RawServerDefault,
    IncomingMessage,
    ServerResponse,
    RouteGeneric | { Reply: { error: string } }
>;

export type AdamantiaRequest<
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
> = FastifyRequest<RouteGeneric>;

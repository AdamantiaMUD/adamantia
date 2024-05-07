import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import type { FastifyRequest } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { ResolveFastifyRequestType } from 'fastify/types/type-provider';

type AreaRequestParams = ResolveFastifyRequestType<
    TypeBoxTypeProvider,
    (typeof areaSchema)['schema'],
    RouteGenericInterface
>['params'];

type RoomRequestParams = ResolveFastifyRequestType<
    TypeBoxTypeProvider,
    (typeof roomSchema)['schema'],
    RouteGenericInterface
>['params'];

export const areaSchema = {
    schema: {
        params: Type.Object({
            areaId: Type.String(),
        }),
    },
};

export const roomSchema = {
    schema: {
        params: Type.Object({
            roomId: Type.String(),
        }),
    },
};

export const getAreaRequestParams = (
    request: FastifyRequest
): AreaRequestParams => request.params as AreaRequestParams;

export const getRoomRequestParams = (
    request: FastifyRequest
): RoomRequestParams => request.params as RoomRequestParams;

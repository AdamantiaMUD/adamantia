import type {FC} from 'react';
import React, {useMemo} from 'react';
import {Line} from 'react-konva';

import {ExitDirection} from '~/interfaces';
import {GRID_SIZE} from '~/constants';

import type {RoomLinkNode, RoomNode} from '~/interfaces';

interface ComponentProps {
    fromRoom: RoomNode;
    node: RoomLinkNode;
    toRoom: RoomNode;
}

export const RoomLink: FC<ComponentProps> = (props: ComponentProps) => {
    const {fromRoom, node, toRoom} = props;

    const coords = useMemo<[number, number, number, number]>(
        () => {
            if (fromRoom.id === toRoom.id) {
                /* eslint-disable-next-line array-element-newline,array-bracket-newline */
                return [-1, -1, -1, -1];
            }

            const fromX = fromRoom.coords.x;
            const fromY = fromRoom.coords.y;
            const toX = toRoom.coords.x;
            const toY = toRoom.coords.y;

            switch (node.fromSide) {
                case ExitDirection.NORTH:
                    return [
                        fromX + (GRID_SIZE / 2),
                        fromY,
                        toX + (GRID_SIZE / 2),
                        toY + GRID_SIZE,
                    ];

                case ExitDirection.EAST:
                    return [
                        fromX + GRID_SIZE,
                        fromY + (GRID_SIZE / 2),
                        toX,
                        toY + (GRID_SIZE / 2),
                    ];

                case ExitDirection.SOUTH:
                    return [
                        fromX + (GRID_SIZE / 2),
                        fromY + GRID_SIZE,
                        toX + (GRID_SIZE / 2),
                        toY,
                    ];

                case ExitDirection.WEST:
                    return [
                        fromX,
                        fromY + (GRID_SIZE / 2),
                        toX + GRID_SIZE,
                        toY + (GRID_SIZE / 2),
                    ];

                default:
                    /* eslint-disable-next-line array-element-newline,array-bracket-newline */
                    return [-1, -1, -1, -1];
            }
        },
        [
            fromRoom,
            node,
            toRoom,
        ]
    );

    if (fromRoom.id === toRoom.id) {
        return null;
    }

    return (<Line points={coords} stroke="black" />);
};

export default RoomLink;

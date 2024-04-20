import React from 'react';
import {Layer} from 'react-konva';
import {useRecoilValue} from 'recoil';

import type {FC} from 'react';

import Room from '~/components/canvas/rooms/room';

import {roomsList} from '~/state/rooms-state';

import type {RoomNode} from '~/interfaces';

export const RoomLayer: FC = () => {
    const rooms = useRecoilValue(roomsList);

    return (
        <Layer>
            {rooms.map((room: RoomNode) => (
                <Room key={`${room.id}.${room.lastUpdate}`} node={room} />
            ))}
        </Layer>
    );
};

export default RoomLayer;

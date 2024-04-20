import type { FC } from 'react';
import { Layer } from 'react-konva';
import { useRecoilValue } from 'recoil';

import Room from '~/components/canvas/rooms/room';
import type { RoomNode } from '~/interfaces';
import { roomsList } from '~/state/rooms-state';

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

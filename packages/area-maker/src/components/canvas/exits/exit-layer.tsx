import type { FC } from 'react';
import { Layer } from 'react-konva';
import { useRecoilValue } from 'recoil';

import RoomLink from '~/components/canvas/exits/room-link';
import type { RoomLinkNode } from '~/interfaces';
import { roomLinksList } from '~/state/room-links-state';
import roomsState from '~/state/rooms-state';

/**
 * Each exit 'node' has two references: one for each room it connects
 *
 * When adding an exit to a room, it should automatically add a corresponding
 * exit to the other room (if possible)
 *   - What if the corresponding exit already exists and points elsewhere?
 *
 * When removing an exit from a room, it should automatically remove the
 * corresponding exit from the other room (if it points to "this" room)
 *   - Prompt to remove the corresponding exit
 */

export const ExitLayer: FC = () => {
    const roomLinks = useRecoilValue(roomLinksList);
    const rooms = useRecoilValue(roomsState);

    return (
        <Layer>
            {roomLinks.map((link: RoomLinkNode) => (
                <RoomLink
                    key={link.id}
                    fromRoom={rooms[link.fromRoom]}
                    node={link}
                    toRoom={rooms[link.toRoom]}
                />
            ))}
        </Layer>
    );
};

export default ExitLayer;

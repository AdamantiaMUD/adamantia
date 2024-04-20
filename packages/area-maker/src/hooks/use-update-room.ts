import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import type { RoomNode, UpdateRoomFunc } from '~/interfaces';
import roomsState from '~/state/rooms-state';

export const useUpdateRoom = (): UpdateRoomFunc => {
    const setRooms = useSetRecoilState(roomsState);

    return useCallback(
        (room: RoomNode) =>
            setRooms(
                (prev: Record<string, RoomNode>): Record<string, RoomNode> => {
                    const newRooms = { ...prev };

                    newRooms[room.id] = {
                        ...room,
                        lastUpdate: Date.now(),
                    };

                    return newRooms;
                }
            ),
        [setRooms]
    );
};

export default useUpdateRoom;

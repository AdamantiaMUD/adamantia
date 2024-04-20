import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import type { RoomNode, UpdateRoomsFunc } from '~/interfaces';
import roomsState from '~/state/rooms-state';

export const useUpdateRooms = (): UpdateRoomsFunc => {
    const setRooms = useSetRecoilState(roomsState);

    return useCallback(
        (rooms: RoomNode[]) =>
            setRooms(
                (prev: Record<string, RoomNode>): Record<string, RoomNode> => {
                    const newRooms = { ...prev };

                    for (const room of rooms) {
                        newRooms[room.id] = {
                            ...room,
                            lastUpdate: Date.now(),
                        };
                    }

                    return newRooms;
                }
            ),
        [setRooms]
    );
};

export default useUpdateRooms;

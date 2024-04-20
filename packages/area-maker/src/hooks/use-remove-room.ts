import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import type { RemoveRoomFunc, RoomNode } from '~/interfaces';
import roomsState from '~/state/rooms-state';

export const useRemoveRoom = (): RemoveRoomFunc => {
    const setRooms = useSetRecoilState(roomsState);

    return useCallback(
        (roomId: string): void => {
            setRooms(
                (prev: Record<string, RoomNode>): Record<string, RoomNode> => {
                    const newRooms = { ...prev };

                    delete newRooms[roomId];

                    return newRooms;
                }
            );
        },
        [setRooms]
    );
};

export default useRemoveRoom;

import {useCallback} from 'react';
import {useSetRecoilState} from 'recoil';

import roomsState from '~/state/rooms-state';

import type {RoomNode, UpdateRoomsFunc} from '~/interfaces';

export const useUpdateRooms = (): UpdateRoomsFunc => {
    const setRooms = useSetRecoilState(roomsState);

    return useCallback(
        (rooms: RoomNode[]) => setRooms((prev: {[key: string]: RoomNode}): {[key: string]: RoomNode} => {
            const newRooms = {...prev};

            for (const room of rooms) {
                newRooms[room.id] = {
                    ...room,
                    lastUpdate: Date.now(),
                };
            }

            return newRooms;
        }),
        [setRooms]
    );
};

export default useUpdateRooms;

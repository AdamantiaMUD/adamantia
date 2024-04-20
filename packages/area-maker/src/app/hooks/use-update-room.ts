import {useCallback} from 'react';
import {useSetRecoilState} from 'recoil';

import roomsState from '~/state/rooms-state';

import type {RoomNode, UpdateRoomFunc} from '~/interfaces';

export const useUpdateRoom = (): UpdateRoomFunc => {
    const setRooms = useSetRecoilState(roomsState);

    return useCallback(
        (room: RoomNode) => setRooms((prev: {[key: string]: RoomNode}): {[key: string]: RoomNode} => {
            const newRooms = {...prev};

            newRooms[room.id] = {
                ...room,
                lastUpdate: Date.now(),
            };

            return newRooms;
        }),
        [setRooms]
    );
};

export default useUpdateRoom;

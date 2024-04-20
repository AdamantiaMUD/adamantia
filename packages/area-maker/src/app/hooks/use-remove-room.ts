import {useCallback} from 'react';
import {useSetRecoilState} from 'recoil';

import roomsState from '~/state/rooms-state';

import type {RemoveRoomFunc, RoomNode} from '~/interfaces';

export const useRemoveRoom = (): RemoveRoomFunc => {
    const setRooms = useSetRecoilState(roomsState);

    return useCallback(
        (roomId: string): void => {
            setRooms((prev: {[key: string]: RoomNode}): {[key: string]: RoomNode} => {
                const newRooms = {...prev};

                delete newRooms[roomId];

                return newRooms;
            });
        },
        [setRooms]
    );
};

export default useRemoveRoom;

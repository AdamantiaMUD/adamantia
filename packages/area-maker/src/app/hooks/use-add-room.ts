import {useCallback} from 'react';
import {v4 as uuid} from 'uuid';
import {useSetRecoilState} from 'recoil';
import produce from 'immer';

import type {Draft} from 'immer';

import roomsState from '~/state/rooms-state';
import {getSnappedCoords} from '~/utils/grid';

import type {AddRoomFunc, Position, RoomNode} from '~/interfaces';

export const useAddRoom = (): AddRoomFunc => {
    const setRooms = useSetRecoilState(roomsState);

    return useCallback(
        (coords: Position): void => {
            setRooms(produce((draft: Draft<{[key: string]: RoomNode}>): void => {
                const newId = uuid();

                draft[newId] = {
                    id: newId,
                    color: '#666',
                    coords: getSnappedCoords(coords),
                    roomDef: {
                        id: newId,
                        title: 'New Room',
                        description: '',
                    },
                    lastUpdate: Date.now(),
                };
            }));
        },
        [setRooms]
    );
};

export default useAddRoom;

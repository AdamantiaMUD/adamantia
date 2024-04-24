import { type Draft, produce } from 'immer';
import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';

import type { AddRoomFunc, Position, RoomNode } from '~/interfaces';
import roomsState from '~/state/rooms-state';
import { getSnappedCoords } from '~/utils/grid';

export const useAddRoom = (): AddRoomFunc => {
    const setRooms = useSetRecoilState(roomsState);

    return useCallback(
        (coords: Position): void => {
            setRooms(
                produce((draft: Draft<Record<string, RoomNode>>): void => {
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
                })
            );
        },
        [setRooms]
    );
};

export default useAddRoom;

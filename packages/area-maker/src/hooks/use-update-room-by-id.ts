import merge from 'deepmerge';
import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import type { PartialDeep } from 'type-fest';

import type { RoomNode, UpdateRoomByIdFunc } from '~/interfaces';
import roomsState from '~/state/rooms-state';
import { cast } from '~/utils/fns';

export const useUpdateRoomById = (): UpdateRoomByIdFunc => {
    const setRooms = useSetRecoilState(roomsState);

    return useCallback(
        (roomId: string, data: PartialDeep<RoomNode>) =>
            setRooms(
                (prev: Record<string, RoomNode>): Record<string, RoomNode> => {
                    const newRooms = { ...prev };

                    newRooms[roomId] = merge.all<RoomNode>([
                        newRooms[roomId],
                        cast<RoomNode>(data),
                        { lastUpdate: Date.now() },
                    ]);

                    return newRooms;
                }
            ),
        [setRooms]
    );
};

export default useUpdateRoomById;

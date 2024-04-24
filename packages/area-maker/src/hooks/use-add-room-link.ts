import { type Draft, produce } from 'immer';
import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';

import type {
    AddRoomLinkFunc,
    ExitDirection,
    RoomLinkNode,
} from '~/interfaces';
import roomLinksState from '~/state/room-links-state';

export const useAddRoomLink = (): AddRoomLinkFunc => {
    const setRoomLinks = useSetRecoilState(roomLinksState);

    return useCallback(
        (fromRoom: string, fromSide: ExitDirection): string => {
            const newId = uuid();

            setRoomLinks(
                produce((draft: Draft<Record<string, RoomLinkNode>>): void => {
                    draft[newId] = {
                        id: newId,
                        fromRoom: fromRoom,
                        fromSide: fromSide,
                        toRoom: fromRoom,
                    };
                })
            );

            return newId;
        },
        [setRoomLinks]
    );
};

export default useAddRoomLink;

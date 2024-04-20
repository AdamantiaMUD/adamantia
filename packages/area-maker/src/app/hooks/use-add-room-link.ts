import {useCallback} from 'react';
import {v4 as uuid} from 'uuid';
import {useSetRecoilState} from 'recoil';
import produce from 'immer';

import type {Draft} from 'immer';

import roomLinksState from '~/state/room-links-state';

import type {AddRoomLinkFunc, ExitDirection, RoomLinkNode} from '~/interfaces';

export const useAddRoomLink = (): AddRoomLinkFunc => {
    const setRoomLinks = useSetRecoilState(roomLinksState);

    return useCallback(
        (fromRoom: string, fromSide: ExitDirection): string => {
            const newId = uuid();

            setRoomLinks(produce((draft: Draft<{[key: string]: RoomLinkNode}>): void => {
                draft[newId] = {
                    id: newId,
                    fromRoom: fromRoom,
                    fromSide: fromSide,
                    toRoom: fromRoom,
                };
            }));

            return newId;
        },
        [setRoomLinks]
    );
};

export default useAddRoomLink;

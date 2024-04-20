import {useCallback} from 'react';
import {useSetRecoilState} from 'recoil';

import roomLinksState from '~/state/room-links-state';

import type {RemoveRoomLinkFunc, RoomLinkNode} from '~/interfaces';

export const useRemoveRoomLink = (): RemoveRoomLinkFunc => {
    const setRoomLinks = useSetRecoilState(roomLinksState);

    return useCallback(
        (roomLinkId: string): void => {
            setRoomLinks((prev: {[key: string]: RoomLinkNode}): {[key: string]: RoomLinkNode} => {
                const newRoomLinks = {...prev};

                delete newRoomLinks[roomLinkId];

                return newRoomLinks;
            });
        },
        [setRoomLinks]
    );
};

export default useRemoveRoomLink;

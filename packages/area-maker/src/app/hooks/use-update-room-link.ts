import {useCallback} from 'react';
import {useSetRecoilState} from 'recoil';

import roomLinksState from '~/state/room-links-state';

import type {RoomLinkNode, UpdateRoomLinkFunc} from '~/interfaces';

export const useUpdateRoomLink = (): UpdateRoomLinkFunc => {
    const setRoomLinks = useSetRecoilState(roomLinksState);

    return useCallback(
        (roomLink: RoomLinkNode) => setRoomLinks((prev: {[key: string]: RoomLinkNode}): {[key: string]: RoomLinkNode} => {
            const newRoomLinks = {...prev};

            newRoomLinks[roomLink.id] = {...roomLink};

            return newRoomLinks;
        }),
        [setRoomLinks]
    );
};

export default useUpdateRoomLink;

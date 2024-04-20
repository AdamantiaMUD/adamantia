import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import type { RoomLinkNode, UpdateRoomLinkFunc } from '~/interfaces';
import roomLinksState from '~/state/room-links-state';

export const useUpdateRoomLink = (): UpdateRoomLinkFunc => {
    const setRoomLinks = useSetRecoilState(roomLinksState);

    return useCallback(
        (roomLink: RoomLinkNode) =>
            setRoomLinks(
                (
                    prev: Record<string, RoomLinkNode>
                ): Record<string, RoomLinkNode> => {
                    const newRoomLinks = { ...prev };

                    newRoomLinks[roomLink.id] = { ...roomLink };

                    return newRoomLinks;
                }
            ),
        [setRoomLinks]
    );
};

export default useUpdateRoomLink;

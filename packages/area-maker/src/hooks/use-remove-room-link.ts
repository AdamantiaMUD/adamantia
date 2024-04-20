import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import type { RemoveRoomLinkFunc, RoomLinkNode } from '~/interfaces';
import roomLinksState from '~/state/room-links-state';

export const useRemoveRoomLink = (): RemoveRoomLinkFunc => {
    const setRoomLinks = useSetRecoilState(roomLinksState);

    return useCallback(
        (roomLinkId: string): void => {
            setRoomLinks(
                (
                    prev: Record<string, RoomLinkNode>
                ): Record<string, RoomLinkNode> => {
                    const newRoomLinks = { ...prev };

                    delete newRoomLinks[roomLinkId];

                    return newRoomLinks;
                }
            );
        },
        [setRoomLinks]
    );
};

export default useRemoveRoomLink;

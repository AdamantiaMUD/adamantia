import { type GetRecoilValue, atom, selector } from 'recoil';

import type { RoomNode } from '~/interfaces';
import localForageEffect from '~/state/persistor';

export const selectedRoomState = atom<string>({
    key: 'selectedId',
    default: '',
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    effects_UNSTABLE: [
        localForageEffect('adamantia-area-maker:selected-room-id'),
    ],
});

export const roomsState = atom<Record<string, RoomNode>>({
    key: 'rooms',
    default: {},
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    effects_UNSTABLE: [localForageEffect('adamantia-area-maker:rooms')],
});

export const roomsList = selector<RoomNode[]>({
    key: 'roomsList',
    get: ({ get }: { get: GetRecoilValue }): RoomNode[] => {
        const rooms = get(roomsState);

        return Object.values(rooms);
    },
});

export default roomsState;

import {atom, selector} from 'recoil';

import type {GetRecoilValue} from 'recoil';

import localForageEffect from '~/state/persistor';

import type {RoomLinkNode} from '~/interfaces';

export const roomLinksState = atom<{[key: string]: RoomLinkNode}>({
    'key': 'roomLinks',
    'default': {},
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    'effects_UNSTABLE': [localForageEffect('adamantia-area-maker:room-links')],
});

export const roomLinksList = selector<RoomLinkNode[]>({
    key: 'roomLinksList',
    get: ({get}: {get: GetRecoilValue}): RoomLinkNode[] => {
        const roomLinks = get(roomLinksState);

        return Object.values(roomLinks);
    },
});

export default roomLinksState;

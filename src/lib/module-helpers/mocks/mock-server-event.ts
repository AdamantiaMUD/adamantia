import {noop} from '../../util/functions';

import type MudEventListenerDefinition from '../../events/mud-event-listener-definition';

const mockServerEvent: MudEventListenerDefinition<unknown[]> = {
    name: 'mock server event',
    listener: () => noop,
};

export default mockServerEvent;

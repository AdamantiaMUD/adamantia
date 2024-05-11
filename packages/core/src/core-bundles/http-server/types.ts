import type { RoomDefinition, RoomExitDefinition } from '../../lib/index.js';

export type AugmentedRoomExitDefinition = RoomExitDefinition & {
    name: string;
};

export type AugmentedRoomDefinition = Omit<RoomDefinition, 'exits'> & {
    exits: AugmentedRoomExitDefinition[];
};

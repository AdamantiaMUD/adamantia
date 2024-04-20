import {ExitDirection} from '~/interfaces';

export const getMirrorDirection = (direction: ExitDirection): ExitDirection => {
    switch (direction) {
        case ExitDirection.EAST:
            return ExitDirection.WEST;

        case ExitDirection.WEST:
            return ExitDirection.EAST;

        case ExitDirection.SOUTH:
            return ExitDirection.NORTH;

        case ExitDirection.NORTH:
            return ExitDirection.SOUTH;

        default:
            return direction;
    }
};

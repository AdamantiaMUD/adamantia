import {GRID_SIZE} from '~/constants';

import type {Position} from '~/interfaces';

export const getSnappedCoordinate = (coord: number): number => Math.round(coord / GRID_SIZE) * GRID_SIZE;

export const getSnappedCoords = (coords: Position): Position => ({
    x: getSnappedCoordinate(coords.x),
    y: getSnappedCoordinate(coords.y),
});

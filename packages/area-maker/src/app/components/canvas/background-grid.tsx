import React, {useMemo} from 'react';
import {Layer, Line} from 'react-konva';
import {useDebounce} from 'use-debounce';

import type {FC} from 'react';

import {DEBOUNCE_DELAY_FAST, GRID_BUFFER, GRID_SIZE} from '~/constants';
import {getSnappedCoordinate} from '~/utils/grid';

import type {Position} from '~/interfaces';

interface ComponentProps {
    stageCoords: Position;
}

export const BackgroundGrid: FC<ComponentProps> = ({stageCoords}: ComponentProps) => {
    const {x, y} = stageCoords;

    const [throttledX] = useDebounce(x, DEBOUNCE_DELAY_FAST);
    const [throttledY] = useDebounce(y, DEBOUNCE_DELAY_FAST);

    const {
        startX,
        endX,
        startY,
        endY,
    } = useMemo(
        () => {
            const snappedX = getSnappedCoordinate(throttledX);
            const snappedY = getSnappedCoordinate(throttledY);

            return {
                startX: (-1 * snappedX) - GRID_BUFFER,
                endX: (-1 * snappedX) + window.innerWidth + GRID_BUFFER,
                startY: (-1 * snappedY) - GRID_BUFFER,
                endY: (-1 * snappedY) + window.innerHeight + GRID_BUFFER,
            };
        },
        [throttledX, throttledY]
    );

    const gridLines: React.ReactNode[] = useMemo(
        () => {
            const lines: React.ReactNode[] = [];

            for (let i = startX; i < endX; i += GRID_SIZE) {
                lines.push((
                    <Line
                        points={[
                            i,
                            startY,
                            i,
                            endY,
                        ]}
                        stroke="#999"
                        strokeWidth={1}
                    />
                ));
            }

            for (let i = startY; i < endY; i += GRID_SIZE) {
                lines.push((
                    <Line
                        points={[
                            startX,
                            i,
                            endX,
                            i,
                        ]}
                        stroke="#999"
                        strokeWidth={1}
                    />
                ));
            }

            return lines;
        },
        [
            startX,
            endX,
            startY,
            endY,
        ]
    );

    return (<Layer>{gridLines}</Layer>);
};

export default BackgroundGrid;

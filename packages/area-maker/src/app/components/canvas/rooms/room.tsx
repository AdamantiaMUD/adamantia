import React, {useCallback, useState} from 'react';
import {Rect} from 'react-konva';
import {useRecoilState} from 'recoil';
import {useDebounce, useDebouncedCallback} from 'use-debounce';

import type Konva from 'konva';
import type {FC} from 'react';

import useUpdateRoom from '~/hooks/use-update-room';
import {DEBOUNCE_DELAY_FAST, GRID_SIZE} from '~/constants';
import {getSnappedCoordinate, getSnappedCoords} from '~/utils/grid';
import {selectedRoomState} from '~/state/rooms-state';

import type {Position, RoomNode} from '~/interfaces';

interface ComponentProps {
    node: RoomNode;
}

export const Room: FC<ComponentProps> = (props: ComponentProps) => {
    const {node} = props;

    const [selectedRoomId, setSelectedRoom] = useRecoilState(selectedRoomState);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragCoords, setDragCoords] = useState<Position>(node.coords);
    const updateRoom = useUpdateRoom();

    const [[shadowX, shadowY]] = useDebounce<[number, number]>(
        [getSnappedCoordinate(dragCoords.x), getSnappedCoordinate(dragCoords.y)],
        DEBOUNCE_DELAY_FAST,
        {maxWait: DEBOUNCE_DELAY_FAST}
    );

    const handleMove = useDebouncedCallback(
        (e: Konva.KonvaEventObject<DragEvent>) => {
            /* eslint-disable-next-line no-param-reassign */
            e.cancelBubble = true;

            const {x, y} = e.target.attrs as Position;

            setDragCoords({x, y});
        },
        DEBOUNCE_DELAY_FAST,
        {maxWait: DEBOUNCE_DELAY_FAST}
    );

    const handleClick = useCallback(
        (e: Konva.KonvaEventObject<MouseEvent>): void => {
            /* eslint-disable-next-line no-param-reassign */
            e.cancelBubble = true;

            setSelectedRoom(node.id);
        },
        [node.id, setSelectedRoom]
    );

    const dragEnd = useCallback(
        (e: Konva.KonvaEventObject<DragEvent>) => {
            /* eslint-disable-next-line no-param-reassign */
            e.cancelBubble = true;

            setIsDragging(false);
            updateRoom({
                ...node,
                coords: getSnappedCoords(dragCoords),
            });
        },
        [
            dragCoords,
            node,
            setIsDragging,
            updateRoom,
        ]
    );

    const dragStart = useCallback(
        (e: Konva.KonvaEventObject<DragEvent>) => {
            /* eslint-disable-next-line no-param-reassign */
            e.cancelBubble = true;

            setIsDragging(true);
        },
        [setIsDragging]
    );

    const isSelected = selectedRoomId === node.id;

    return (
        <React.Fragment>
            {isDragging && (
                <Rect
                    x={shadowX}
                    y={shadowY}
                    fill="#00f"
                    height={GRID_SIZE - 1}
                    width={GRID_SIZE - 1}
                    stroke="#999"
                    strokeWidth={1}
                />
            )}
            <Rect
                draggable
                x={node.coords.x}
                y={node.coords.y}
                fill={isSelected ? '#fb4' : node.color}
                height={GRID_SIZE}
                width={GRID_SIZE}
                stroke={isSelected ? '#fff' : '#222'}
                strokeWidth={1}
                onClick={handleClick}
                onDragEnd={dragEnd}
                onDragMove={handleMove.callback}
                onDragStart={dragStart}
            />
        </React.Fragment>
    );
};

export default Room;

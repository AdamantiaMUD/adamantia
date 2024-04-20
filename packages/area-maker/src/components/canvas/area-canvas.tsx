import type Konva from 'konva';
import { type FC, useCallback, useRef, useState } from 'react';
import { Stage } from 'react-konva';
import {
    useRecoilBridgeAcrossReactRoots_UNSTABLE,
    useSetRecoilState,
} from 'recoil';
import { useDebouncedCallback } from 'use-debounce';

import BackgroundGrid from '~/components/canvas/background-grid';
import ExitLayer from '~/components/canvas/exits/exit-layer';
import RoomLayer from '~/components/canvas/rooms/room-layer';
import ControlPanel from '~/components/control-panel/control-panel';
import Portal from '~/components/general/portal';
import { DEBOUNCE_DELAY_SLOW } from '~/constants';
import type { Position } from '~/interfaces';
import { selectedRoomState } from '~/state/rooms-state';

const AreaCanvas: FC = () => {
    const [stageCoords, setStageCoords] = useState<Position>({ x: 0, y: 0 });
    const stageRef = useRef<Konva.Stage | null>(null);
    const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

    const setSelectedId = useSetRecoilState(selectedRoomState);

    const selectItem = useCallback(
        (e: Konva.KonvaEventObject<MouseEvent>, itemId: string): void => {
            /* eslint-disable-next-line no-param-reassign */
            e.cancelBubble = true;

            setSelectedId(itemId);
        },
        [setSelectedId]
    );

    const logMovement = useDebouncedCallback(
        ({ target }: Konva.KonvaEventObject<DragEvent>) => {
            if (
                target.nodeType === 'Stage' &&
                /* eslint-disable @typescript-eslint/no-unsafe-member-access */
                typeof target.attrs?.x === 'number' &&
                typeof target.attrs?.y === 'number'
                /* eslint-enable @typescript-eslint/no-unsafe-member-access */
            ) {
                const { x, y } = target.attrs as Position;
                setStageCoords({ x, y });
            }
        },
        DEBOUNCE_DELAY_SLOW,
        { maxWait: DEBOUNCE_DELAY_SLOW }
    );

    return (
        <Stage
            draggable
            width={window.innerWidth}
            height={window.innerHeight}
            onClick={(e: Konva.KonvaEventObject<MouseEvent>): void =>
                selectItem(e, '')
            }
            onDragMove={logMovement}
            ref={(el: Konva.Stage | null): void => {
                stageRef.current = el;
            }}
        >
            <RecoilBridge>
                <BackgroundGrid stageCoords={stageCoords} />
                {/* @ts-expect-error -- I don't know why this is busted */}
                <Portal>
                    <ControlPanel stageCoords={stageCoords} />
                </Portal>
                <RoomLayer />
                <ExitLayer />
            </RecoilBridge>
        </Stage>
    );
};

export default AreaCanvas;

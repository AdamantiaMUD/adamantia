import Box from '@mui/material/Box';
import cytoscape, {
    type Core as CytoscapeCore,
    type ElementDefinition,
    type EventObjectNode,
} from 'cytoscape';
import { type FC, useEffect, useRef } from 'react';

import { useAreaContext } from '~/context/area-context';
import { makeCytoscapeStyles } from '~/utils/cytoscape';

export interface CytoscapeCanvasProps {
    id: string;
    className?: string;
    data?: ElementDefinition[];
    layer: number;
}

const defaultData: ElementDefinition[] = [];

export const CytoscapeCanvas: FC<CytoscapeCanvasProps> = ({
    id,
    className = '',
    data = defaultData,
    layer,
}: CytoscapeCanvasProps) => {
    const { selectedRoom, setSelectedRoom } = useAreaContext();

    const container = useRef<HTMLDivElement | null>(null);
    const cyGraph = useRef<CytoscapeCore | null>(null);

    useEffect(() => {
        if (cyGraph.current === null) {
            return;
        }

        cyGraph.current.off('select', 'node');

        /* eslint-disable-next-line prefer-arrow-callback */
        cyGraph.current.on('select', 'node', function (event: EventObjectNode) {
            const node = event.target;
            const nodeId = node.data('id') as string;

            setSelectedRoom(nodeId);
        });
    }, [selectedRoom, setSelectedRoom]);

    useEffect(() => {
        cyGraph.current = cytoscape({
            container: container.current,
            boxSelectionEnabled: false,
            layout: {
                name: 'preset',
                fit: false,
            },
            style: makeCytoscapeStyles(layer),
        });

        /* eslint-disable-next-line prefer-arrow-callback */
        cyGraph.current.on('mouseover', 'node', (event: EventObjectNode) => {
            const node = event.target;

            node.addClass('roomHover');
        });

        /* eslint-disable-next-line prefer-arrow-callback */
        cyGraph.current.on('mouseout', 'node', (event: EventObjectNode) => {
            const node = event.target;

            node.removeClass('roomHover');
        });

        /* eslint-disable-next-line prefer-arrow-callback */
        cyGraph.current.on('select', 'node', function (event: EventObjectNode) {
            const node = event.target;
            const nodeId = node.data('id') as string;

            setSelectedRoom(nodeId);
        });

        /* eslint-disable-next-line prefer-arrow-callback */
        cyGraph.current.on('unselect', 'node', function () {
            setSelectedRoom(null);
        });

        return () => {
            if (cyGraph.current !== null) {
                cyGraph.current.destroy();
                cyGraph.current = null;
            }
        };
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    useEffect(() => {
        if (cyGraph.current !== null) {
            cyGraph.current.elements().remove();
            cyGraph.current.add(data);
            cyGraph.current.center();
            cyGraph.current.autolock(true);
        }
    }, [data]);

    useEffect(() => {
        if (cyGraph.current !== null) {
            cyGraph.current.style(makeCytoscapeStyles(layer));
        }
    }, [layer, selectedRoom]);

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
                backgroundColor: '#aadbff',
            }}
            ref={container}
            id={id}
            className={className}
        />
    );
};

/*
 *const upButton = document.getElementById('up-layer');
 *const downButton = document.getElementById('down-layer');
 *window.addEventListener('click', (e) => {
 *    const {target} = e;
 *
 *    if (target.id !== upButton.id && target.id !== downButton.id) {
 *        return;
 *    }
 *
 *    if (target.id === upButton.id) {
 *        if (currentLayer < maxLayer) {
 *            currentLayer++;
 *        }
 *    }
 *
 *    if (target.id === downButton.id) {
 *        if (currentLayer > minLayer) {
 *            currentLayer--;
 *        }
 *    }
 *
 *    upButton.disabled = false;
 *    downButton.disabled = false;
 *
 *    if (currentLayer === maxLayer) {
 *        upButton.disabled = true;
 *    }
 *
 *    if (currentLayer === minLayer) {
 *        downButton.disabled = true;
 *    }
 *
 *    layerDisplay.innerHTML = currentLayer;
 *});
 *
 *const fileSelector = document.getElementById('file-selector');
 *fileSelector.addEventListener('change', async (e) => {
 *    const file = e.target.files[0];
 *    const text = await file.text();
 *    const data = JSON.parse(text);
 *
 *    process(data);
 *});
 */

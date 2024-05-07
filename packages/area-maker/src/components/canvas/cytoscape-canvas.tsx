import { Box } from '@mui/material';
import cytoscape, {
    type Core as CytoscapeCore,
    type EventObjectNode,
} from 'cytoscape';
import { type FC, useEffect, useRef } from 'react';

import { useAreaContext } from '~/context/area-context';
import { makeCytoscapeStyles } from '~/utils/cytoscape';

const CytoscapeCanvas: FC = () => {
    const { layer, roomNodes, selectedRoom, setSelectedRoom } =
        useAreaContext();

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

            if (!node.hasClass('external')) {
                node.addClass('roomHover');
            }
        });

        /* eslint-disable-next-line prefer-arrow-callback */
        cyGraph.current.on('mouseout', 'node', (event: EventObjectNode) => {
            const node = event.target;

            if (!node.hasClass('external')) {
                node.removeClass('roomHover');
            }
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
            cyGraph.current.add(roomNodes);
            cyGraph.current.center();
            cyGraph.current.autolock(true);
        }
    }, [roomNodes]);

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
            id="mud"
        />
    );
};

export default CytoscapeCanvas;

import Box from '@mui/material/Box';
import type { FC } from 'react';

import ControlPanel from '~/components/control-panel/control-panel';
import { useAreaContext } from '~/context/area-context';

import { CytoscapeCanvas } from './cytoscape-canvas';

export const AreaCanvas: FC = () => {
    const { layer, roomNodes } = useAreaContext();

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
            <ControlPanel />
            <CytoscapeCanvas id="mud" layer={layer} data={roomNodes} />
        </Box>
    );
};

export default AreaCanvas;

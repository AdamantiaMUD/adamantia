import { Box } from '@mui/material';
import type { FC } from 'react';

import ControlPanel from '../control-panel/control-panel';

import CytoscapeCanvas from './cytoscape-canvas';

export const AreaCanvas: FC = () => (
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
        <CytoscapeCanvas />
    </Box>
);

export default AreaCanvas;

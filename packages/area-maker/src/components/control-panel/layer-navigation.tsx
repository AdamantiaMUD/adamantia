import { Box, Button, Typography } from '@mui/material';
import type { FC } from 'react';

import { useAreaContext } from '~/context/area-context';

export const LayerNavigation: FC = () => {
    const { area, handleLayerDown, handleLayerUp, layer, minMax } =
        useAreaContext();

    if (area === null) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <Button
                sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                variant="contained"
                size="small"
                disabled={layer === minMax.min}
                id="down-layer"
                onClick={handleLayerDown}
            >
                Down
            </Button>
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography>
                    Current layer: {layer} (from {minMax.min} to {minMax.max})
                </Typography>
            </Box>
            <Button
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                variant="contained"
                size="small"
                disabled={layer === minMax.max}
                id="up-layer"
                onClick={handleLayerUp}
            >
                Up
            </Button>
        </Box>
    );
};

export default LayerNavigation;

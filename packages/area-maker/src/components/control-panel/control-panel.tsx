import { Card, CardContent, Divider, Typography } from '@mui/material';
import type { FC } from 'react';

import AreaDetails from '~/components/control-panel/area/area-details';
import AreaSelector from '~/components/control-panel/area-selector';
import LayerNavigation from '~/components/control-panel/layer-navigation';
import RoomInfo from '~/components/control-panel/rooms/room-info';

export const ControlPanel: FC = () => (
    <Card
        sx={{
            width: '32rem',
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            top: '1rem',
            zIndex: 1000,
        }}
        variant="outlined"
    >
        <CardContent>
            <Typography variant="h5" component="h1">
                AdamantiaMUD Area Maker
            </Typography>
            <Divider />
            <AreaSelector />
            <AreaDetails />
            <LayerNavigation />
            <RoomInfo />
        </CardContent>
    </Card>
);

export default ControlPanel;

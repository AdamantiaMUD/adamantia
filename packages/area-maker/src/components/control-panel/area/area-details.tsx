import { Typography } from '@mui/material';
import type { FC } from 'react';

import { useAreaContext } from '~/context/area-context';

const AreaDetails: FC = () => {
    const { area } = useAreaContext();

    if (area === null) {
        return null;
    }

    return (
        <>
            <Typography variant="h6" component="h3" gutterBottom>
                Area: {area.name}
            </Typography>
            <div>
                <Typography>Rooms: {area.roomCount}</Typography>
            </div>
        </>
    );
};

export default AreaDetails;

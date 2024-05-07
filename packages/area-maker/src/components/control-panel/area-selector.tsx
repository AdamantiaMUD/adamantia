import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
} from '@mui/material';
import type { FC } from 'react';

import { useAreaContext } from '~/context/area-context';
import useAreaList, { type AreaListItem } from '~/hooks/use-area-list';

export const AreaSelector: FC = () => {
    const { areas, isFetching, isPending } = useAreaList();
    const { setArea } = useAreaContext();

    const handleChange = (event: SelectChangeEvent): void => {
        const areaId = event.target.value;
        const area = areas.find((item: AreaListItem) => item.id === areaId);

        if (typeof area !== 'undefined') {
            setArea(area);
        }
    };

    return (
        <FormControl fullWidth size="small">
            <InputLabel id="select-area-label">Select Area</InputLabel>
            <Select
                disabled={isPending || isFetching}
                labelId="select-area-label"
                id="select-area-dropdown"
                label="Select Area"
                onChange={handleChange}
            >
                {areas.map((area: AreaListItem) => (
                    <MenuItem key={area.id} value={area.id}>
                        {area.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default AreaSelector;

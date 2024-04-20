import type { Theme } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createStyles, makeStyles } from '@mui/styles';
import { type FC, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useDebounce } from 'use-debounce';

import RoomInfo from '~/components/control-panel/rooms/room-info';
import { DEBOUNCE_DELAY_SLOW, GRID_SIZE } from '~/constants';
import useAddRoom from '~/hooks/use-add-room';
import type { Position, RoomNode } from '~/interfaces';
import { roomsList, selectedRoomState } from '~/state/rooms-state';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '32rem',
            position: 'absolute',
            right: '1rem',
            top: '1rem',
        },
        divider: {
            marginTop: '1rem',
        },
        areaName: {
            marginBottom: theme.spacing(1),
        },
        foo: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    })
);

interface ComponentProps {
    stageCoords: Position;
}

export const ControlPanel: FC<ComponentProps> = ({
    stageCoords,
}: ComponentProps) => {
    const [coords] = useDebounce(stageCoords, DEBOUNCE_DELAY_SLOW);
    const rooms = useRecoilValue(roomsList);
    const selectedId = useRecoilValue(selectedRoomState);
    const addRoom = useAddRoom();

    const add = useCallback(() => {
        const x = -1 * (coords.x - 2 * GRID_SIZE);
        const y = -1 * (coords.y - 2 * GRID_SIZE);

        addRoom({ x, y });
    }, [addRoom, coords]);

    const classes = useStyles();

    const selectedRoom = useMemo<RoomNode | null>(() => {
        if (selectedId === '') {
            return null;
        }

        return (
            rooms.find((room: RoomNode): boolean => room.id === selectedId) ??
            null
        );
    }, [rooms, selectedId]);

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography variant="h4" component="h1" gutterBottom>
                    AdamantiaMUD Area Maker
                </Typography>
                <hr className={classes.divider} />
                <Typography variant="h4" component="h3" gutterBottom>
                    Area
                </Typography>
                <TextField
                    fullWidth
                    className={classes.areaName}
                    label="Name"
                    size="small"
                />
                <div className={classes.foo}>
                    <Typography>{`Rooms: ${rooms.length}`}</Typography>
                    <Button variant="outlined" onClick={add} size="small">
                        Add Room
                    </Button>
                </div>
                {selectedRoom !== null && (
                    <div key={selectedId}>
                        <hr className={classes.divider} />
                        <Typography variant="h5" component="h3" gutterBottom>
                            Selected Room
                        </Typography>
                        <RoomInfo room={selectedRoom} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ControlPanel;

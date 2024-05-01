import type { Theme } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import type { FC } from 'react';

import RoomInfo from '~/components/control-panel/rooms/room-info';
import { useAreaContext } from '~/context/area-context';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '32rem',
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            top: '1rem',
            zIndex: 1000,
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

export const ControlPanel: FC = () => {
    const classes = useStyles();
    const {
        handleFileChange,
        handleLayerDown,
        handleLayerUp,
        layer,
        minMax,
        name,
        rooms,
        selectedRoom,
    } = useAreaContext();

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography variant="h5" component="h1" gutterBottom>
                    AdamantiaMUD Area Maker
                </Typography>
                <hr className={classes.divider} />
                {Object.keys(rooms).length > 0 && (
                    <>
                        <Typography variant="h6" component="h3" gutterBottom>
                            Area: {name}
                        </Typography>
                        <div>
                            <Typography>
                                Rooms: {Object.keys(rooms).length}
                            </Typography>
                            <Typography>
                                Layer: {layer} ({minMax.max} - {minMax.min})
                            </Typography>
                        </div>
                        <br />
                        <ButtonGroup variant="contained" size="small">
                            <Button
                                disabled={layer === minMax.max}
                                id="up-layer"
                                onClick={handleLayerUp}
                            >
                                Up
                            </Button>
                            <Button
                                disabled={layer === minMax.min}
                                id="down-layer"
                                onClick={handleLayerDown}
                            >
                                Down
                            </Button>
                        </ButtonGroup>
                        <br />
                    </>
                )}
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    size="small"
                >
                    Upload file
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                    />
                </Button>

                {selectedRoom !== null && (
                    <div key={selectedRoom}>
                        <hr className={classes.divider} />
                        <Typography variant="h5" component="h3" gutterBottom>
                            Selected Room
                        </Typography>
                        <RoomInfo roomId={selectedRoom} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ControlPanel;

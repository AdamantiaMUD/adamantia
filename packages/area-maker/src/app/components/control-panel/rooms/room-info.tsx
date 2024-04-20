import React, {
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import produce from 'immer';
import invariant from 'tiny-invariant';
import {useRecoilValue} from 'recoil';

import type {Draft} from 'immer';
import type {FC} from 'react';
import type {Theme} from '@material-ui/core';
import type {RoomDefinition} from '@adamantiamud/core';

import DeleteRoomButton from '~/components/control-panel/rooms/delete-room-button';
import RoomExitList from '~/components/control-panel/exits/room-exit-list';
import useUpdateRoom from '~/hooks/use-update-room';
import {roomsList} from '~/state/rooms-state';

import type {RoomNode} from '~/interfaces';

interface ComponentProps {
    room: RoomNode;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        '& > *': {
            marginBottom: theme.spacing(2),
        },
        '& > *:last-child': {
            marginBottom: 0,
        },
    },
    btnWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
    },
}));

export const RoomInfo: FC<ComponentProps> = ({room}: ComponentProps) => {
    const [roomData, setRoomData] = useState<RoomDefinition>(room.roomDef);
    const classes = useStyles();

    const rooms = useRecoilValue(roomsList);
    const updateRoom = useUpdateRoom();

    const {roomDef} = room;

    const isDirty = useMemo<boolean>(
        () => roomData.title !== roomDef.title || roomData.description !== roomDef.description,
        [roomData, roomDef]
    );

    const setDescription = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRoomData(produce(roomData, (draft: Draft<RoomDefinition>) => {
                draft.description = event.target.value;
            }));
        },
        [roomData, setRoomData]
    );

    const setTitle = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRoomData(produce(roomData, (draft: Draft<RoomDefinition>) => {
                draft.title = event.target.value;
            }));
        },
        [roomData, setRoomData]
    );

    const saveChanges = useCallback(
        () => {
            updateRoom(produce(room, (draft: Draft<RoomNode>) => {
                draft.roomDef.title = roomData.title;
                draft.roomDef.description = roomData.description;
            }));
        },
        [
            room,
            roomData,
            updateRoom,
        ]
    );

    /* eslint-disable jsx-a11y/no-autofocus */
    return (
        <div className={classes.root}>
            <TextField
                disabled
                fullWidth
                label="ID"
                value={room.id}
                size="small"
            />
            <TextField
                fullWidth
                label="Title"
                value={roomData.title}
                size="small"
                onChange={setTitle}
            />
            <TextField
                fullWidth
                multiline
                label="Description"
                rows={4}
                value={roomData.description}
                variant="outlined"
                size="small"
                onChange={setDescription}
            />
            <div className={classes.btnWrapper}>
                <Button
                    disabled={!isDirty}
                    variant="contained"
                    color="primary"
                    onClick={saveChanges}
                    size="small"
                >
                    Save
                </Button>
                <DeleteRoomButton />
            </div>
            {rooms.length > 1 && (
                <React.Fragment>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Exits
                    </Typography>
                    <RoomExitList room={room} />
                </React.Fragment>
            )}
        </div>
    );
    /* eslint-enable jsx-a11y/no-autofocus */
};

export default RoomInfo;

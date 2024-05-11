import type { RoomDefinition } from '@adamantiamud/core';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { type Draft, produce } from 'immer';
import {
    type ChangeEvent,
    type FC,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import RoomExitList from '~/components/control-panel/exits/room-exit-list';
import { useAreaContext } from '~/context/area-context';
import useRoom from '~/hooks/use-room';
import useUpdateRoom from '~/hooks/use-update-room';

export const RoomInfo: FC = () => {
    const { selectedRoom } = useAreaContext();

    const { data, error, isFetching } = useRoom(selectedRoom);
    const update = useUpdateRoom(selectedRoom);

    const [roomData, setRoomData] = useState<RoomDefinition | null>(data);
    const [roomDef, setRoomDef] = useState<RoomDefinition | null>(data);

    useEffect(() => {
        setRoomData(data);
        setRoomDef(data);
    }, [data]);

    const isDirty = useMemo<boolean>(() => {
        if (roomData === null || roomDef === null) {
            return false;
        }

        return (
            roomData.title !== roomDef.title ||
            roomData.description !== roomDef.description
        );
    }, [roomData, roomDef]);

    const setDescription = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setRoomData(
                produce(roomData, (draft: Draft<RoomDefinition>) => {
                    draft.description = event.target.value;
                })
            );
        },
        [roomData, setRoomData]
    );

    const setTitle = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setRoomData(
                produce(roomData, (draft: Draft<RoomDefinition>) => {
                    draft.title = event.target.value;
                })
            );
        },
        [roomData, setRoomData]
    );

    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    const saveChanges = (): void => {
        if (roomData === null) {
            return;
        }

        update.mutate({
            description: roomData.description,
            title: roomData.title,
        });
    };

    if (isFetching) {
        return <Typography>Loading...</Typography>;
    }

    if (error !== null) {
        return <Typography>Error: {error.message}</Typography>;
    }

    if (roomData === null || roomDef === null) {
        return null;
    }

    return (
        <>
            <Divider />
            <Typography variant="h5" component="h3" gutterBottom>
                Selected Room
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <TextField
                    disabled
                    fullWidth
                    label="ID"
                    value={selectedRoom}
                    size="small"
                />
                <TextField
                    disabled={update.isPending}
                    fullWidth
                    label="Title"
                    value={roomData.title}
                    size="small"
                    onChange={setTitle}
                />
                <TextField
                    disabled={update.isPending}
                    fullWidth
                    multiline
                    label="Description"
                    rows={4}
                    value={roomData.description}
                    variant="outlined"
                    size="small"
                    onChange={setDescription}
                />
                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Button
                        disabled={!isDirty || update.isPending}
                        variant="contained"
                        color="primary"
                        onClick={saveChanges}
                        size="small"
                    >
                        Save
                    </Button>
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                    Exits
                </Typography>
                <RoomExitList room={roomDef} />
            </Box>
        </>
    );
};

export default RoomInfo;

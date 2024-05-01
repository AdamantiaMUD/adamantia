import type { RoomDefinition } from '@adamantiamud/core';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { type Draft, produce } from 'immer';
import {
    type ChangeEvent,
    type FC,
    useCallback,
    useMemo,
    useState,
} from 'react';

import RoomExitList from '~/components/control-panel/exits/room-exit-list';
import { useAreaContext } from '~/context/area-context';

interface ComponentProps {
    roomId: string;
}

export const RoomInfo: FC<ComponentProps> = ({ roomId }: ComponentProps) => {
    const { rooms } = useAreaContext();
    const [roomData, setRoomData] = useState<RoomDefinition>(rooms[roomId]);
    const roomDef = rooms[roomId];

    const isDirty = useMemo<boolean>(
        () =>
            roomData.title !== roomDef.title ||
            roomData.description !== roomDef.description,
        [roomData, roomDef]
    );

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
    const saveChanges = (): void => {};
    /*
     *const saveChanges = useCallback(() => {
     *    updateRoom(
     *        produce(room, (draft: Draft<RoomNode>) => {
     *            draft.roomDef.title = roomData.title;
     *            draft.roomDef.description = roomData.description;
     *        })
     *    );
     *}, [room, roomData, updateRoom]);
     */

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField
                disabled
                fullWidth
                label="ID"
                value={roomId}
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
            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                    disabled={!isDirty}
                    variant="contained"
                    color="primary"
                    onClick={saveChanges}
                    size="small"
                >
                    Save
                </Button>
            </Box>
            {(roomData.exits ?? []).length > 1 && (
                <>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Exits
                    </Typography>
                    <RoomExitList roomId={roomId} />
                </>
            )}
        </Box>
    );
};

export default RoomInfo;

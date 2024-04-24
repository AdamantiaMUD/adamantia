import type {
    Direction,
    RoomDefinition,
    RoomExitDefinition,
} from '@adamantiamud/core';
import Autocomplete, {
    type AutocompleteProps,
    type AutocompleteRenderInputParams,
    type AutocompleteValue,
} from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { createStyles, makeStyles } from '@mui/styles';
import { type Draft, produce } from 'immer';
import { type FC, type SyntheticEvent, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import useUpdateRoomLink from '~/hooks/use-update-room-link';
import useUpdateRooms from '~/hooks/use-update-rooms';
import type { ExitDirection, RoomLinkNode, RoomNode } from '~/interfaces';
import { roomLinksState } from '~/state/room-links-state';
import { roomsList, roomsState } from '~/state/rooms-state';
import { getMirrorDirection } from '~/utils/directions';
import { cast } from '~/utils/fns';

interface ComponentProps {
    direction: ExitDirection;
    room: RoomNode;
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
        },
        roomSelect: {
            flexGrow: 1,
        },
    })
);

export const RoomExitDetails: FC<ComponentProps> = ({
    direction,
    room,
}: ComponentProps) => {
    const rooms = useRecoilValue(roomsList);
    const roomCache = useRecoilValue(roomsState);
    const roomLinkCache = useRecoilValue(roomLinksState);
    const updateRoomLink = useUpdateRoomLink();
    const updateRooms = useUpdateRooms();

    const classes = useStyles();

    const { roomDef } = room;

    const roomOptions = useMemo<RoomDefinition[]>(
        () =>
            rooms.reduce(
                (acc: RoomDefinition[], node: RoomNode) => [
                    ...acc,
                    node.roomDef,
                ],
                []
            ),
        [rooms]
    );

    const roomExit = useMemo<RoomExitDefinition | null>(
        () =>
            roomDef.exits?.find(
                (exit: RoomExitDefinition) =>
                    exit.direction === cast<Direction>(direction)
            ) ?? null,
        [direction, roomDef.exits]
    );

    const exitRoom = useMemo<RoomDefinition | undefined>(() => {
        if (roomExit === null) {
            return undefined;
        }

        return roomCache[roomExit.roomId].roomDef;
    }, [roomExit, roomCache]);

    const updateExitInfo = useCallback(
        (exitIdx: number, targetId: string): void => {
            const roomUpdates: RoomNode[] = [];

            const roomLinkId = room.roomDef.exits![exitIdx].roomLinkId;
            const prevTargetId = room.roomDef.exits![exitIdx].roomId;

            if (prevTargetId !== room.id) {
                roomUpdates.push(
                    produce(
                        roomCache[prevTargetId],
                        (draft: Draft<RoomNode>) => {
                            draft.roomDef.exits =
                                draft.roomDef.exits?.filter(
                                    (exit: RoomExitDefinition) =>
                                        exit.roomId !== room.id
                                ) ?? [];
                        }
                    )
                );
            }

            roomUpdates.push(
                produce(room, (draft: Draft<RoomNode>) => {
                    draft.roomDef.exits![exitIdx].roomId = targetId;
                })
            );

            if (targetId !== room.id) {
                roomUpdates.push(
                    produce(roomCache[targetId], (draft: Draft<RoomNode>) => {
                        draft.roomDef.exits =
                            draft.roomDef.exits?.filter(
                                (exit: RoomExitDefinition) =>
                                    exit.direction !==
                                    cast<Direction>(direction)
                            ) ?? [];

                        draft.roomDef.exits.push({
                            direction: cast<Direction>(
                                getMirrorDirection(direction)
                            ),
                            roomId: room.id,
                            roomLinkId: roomLinkId,
                        });
                    })
                );
            }

            updateRoomLink(
                produce(
                    roomLinkCache[roomLinkId],
                    (draft: Draft<RoomLinkNode>) => {
                        draft.toRoom = targetId;
                    }
                )
            );
            updateRooms(roomUpdates);
        },
        [direction, room, roomCache, roomLinkCache, updateRoomLink, updateRooms]
    );

    if (roomExit === null) {
        return null;
    }

    const roomSelectProps: AutocompleteProps<
        RoomDefinition,
        false,
        true,
        false
    > = {
        id: '',
        options: roomOptions,
        getOptionLabel: (option: RoomDefinition) => option.title,
        /* eslint-disable-next-line react/no-multi-comp */
        renderInput: (params: AutocompleteRenderInputParams) => (
            <TextField {...params} size="small" variant="standard" />
        ),
        value: exitRoom,
        className: classes.roomSelect,
        disableClearable: true,
        size: 'small',
        onChange: (
            event: SyntheticEvent,
            newValue: AutocompleteValue<RoomDefinition, false, true, false>
        ) => {
            const foundExitIdx = roomDef.exits!.findIndex(
                (exit: RoomExitDefinition) =>
                    exit.direction === cast<Direction>(direction)
            );

            if (foundExitIdx > -1) {
                updateExitInfo(foundExitIdx, newValue.id);
            }
        },
    };

    return (
        <>
            <Autocomplete {...roomSelectProps} />
            <FormControlLabel
                control={
                    <Checkbox
                        // @TODO: try to remember what I was thinking here
                        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
                        /* @ts-expect-error -- wat */
                        checked={roomExit.oneWay ?? false}
                        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
                        color="default"
                        inputProps={{ 'aria-label': 'One-way exit' }}
                    />
                }
                label="One-way exit"
                labelPlacement="end"
            />
        </>
    );
};

export default RoomExitDetails;

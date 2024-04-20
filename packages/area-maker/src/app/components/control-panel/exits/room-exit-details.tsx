import React, {useCallback, useMemo} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import produce from 'immer';
import {useRecoilValue} from 'recoil';

import type {AutocompleteProps, AutocompleteRenderInputParams} from '@material-ui/lab/Autocomplete';
import type {FC, SyntheticEvent} from 'react';
import type {Direction, RoomDefinition, RoomExitDefinition} from '@adamantiamud/core';
import type {Draft} from 'immer';
import type {Value} from '@material-ui/core';

import useUpdateRoomLink from '~/hooks/use-update-room-link';
import useUpdateRooms from '~/hooks/use-update-rooms';
import {cast} from '~/utils/fns';
import {getMirrorDirection} from '~/utils/directions';
import {roomLinksState} from '~/state/room-links-state';
import {roomsState, roomsList} from '~/state/rooms-state';

import type {ExitDirection, RoomLinkNode, RoomNode} from '~/interfaces';

interface ComponentProps {
    direction: ExitDirection;
    room: RoomNode;
}

const useStyles = makeStyles(() => createStyles({
    root: {
        display: 'flex',
    },
    roomSelect: {
        flexGrow: 1,
    },
}));

export const RoomExitDetails: FC<ComponentProps> = ({direction, room}: ComponentProps) => {
    const rooms = useRecoilValue(roomsList);
    const roomCache = useRecoilValue(roomsState);
    const roomLinkCache = useRecoilValue(roomLinksState);
    const updateRoomLink = useUpdateRoomLink();
    const updateRooms = useUpdateRooms();

    const classes = useStyles();

    const {roomDef} = room;

    const roomOptions = useMemo<RoomDefinition[]>(
        () => rooms.reduce(
            (acc: RoomDefinition[], node: RoomNode) => [...acc, node.roomDef],
            []
        ),
        [rooms]
    );

    const roomExit = useMemo<RoomExitDefinition | null>(
        () => roomDef.exits?.find((exit: RoomExitDefinition) => exit.direction === cast<Direction>(direction)) ?? null,
        [direction, roomDef.exits]
    );

    const exitRoom = useMemo<RoomDefinition | undefined>(
        () => {
            if (roomExit === null) {
                return undefined;
            }

            return roomCache[roomExit.roomId]?.roomDef;
        },
        [roomExit, roomCache]
    );

    const updateExitInfo = useCallback(
        (exitIdx: number, targetId: string): void => {
            const roomUpdates: RoomNode[] = [];

            const roomLinkId = room.roomDef.exits![exitIdx].roomLinkId;
            const prevTargetId = room.roomDef.exits![exitIdx].roomId;

            if (prevTargetId !== room.id) {
                roomUpdates.push(produce(roomCache[prevTargetId], (draft: Draft<RoomNode>) => {
                    draft.roomDef.exits = draft.roomDef
                        .exits
                        ?.filter((exit: RoomExitDefinition) => exit.roomId !== room.id) ?? [];
                }));
            }

            roomUpdates.push(produce(room, (draft: Draft<RoomNode>) => {
                draft.roomDef.exits![exitIdx].roomId = targetId;
            }));

            if (targetId !== room.id) {
                roomUpdates.push(produce(roomCache[targetId], (draft: Draft<RoomNode>) => {
                    draft.roomDef.exits = draft.roomDef
                        .exits
                        ?.filter((exit: RoomExitDefinition) => exit.direction !== cast<Direction>(direction)) ?? [];

                    draft.roomDef.exits.push({
                        direction: cast<Direction>(getMirrorDirection(direction)),
                        roomId: room.id,
                        roomLinkId: roomLinkId,
                    });
                }));
            }

            updateRoomLink(produce(roomLinkCache[roomLinkId], (draft: Draft<RoomLinkNode>) => {
                draft.toRoom = targetId;
            }));
            updateRooms(roomUpdates);
        },
        [
            direction,
            room,
            roomCache,
            roomLinkCache,
            updateRoomLink,
            updateRooms,
        ]
    );

    if (roomExit === null) {
        return null;
    }

    const roomSelectProps: AutocompleteProps<RoomDefinition, false, true, false> = {
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
        onChange: (event: SyntheticEvent, newValue: Value<RoomDefinition, false, true, false>) => {
            const foundExitIdx = roomDef.exits!
                .findIndex((exit: RoomExitDefinition) => exit.direction === cast<Direction>(direction));

            if (foundExitIdx > -1) {
                updateExitInfo(foundExitIdx, newValue.id);
            }
        },
    };

    return (
        <React.Fragment>
            <Autocomplete {...roomSelectProps} />
            <FormControlLabel
                control={(
                    <Checkbox
                        checked={roomExit.oneWay ?? false}
                        color="default"
                        inputProps={{'aria-label': 'One-way exit'}}
                    />
                )}
                label="One-way exit"
                labelPlacement="end"
            />
        </React.Fragment>
    );
};

export default RoomExitDetails;

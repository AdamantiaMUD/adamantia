import React, {useCallback, useMemo} from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import produce from 'immer';
import {createStyles, makeStyles} from '@material-ui/core/styles';

import type {Draft} from 'immer';
import type {FC} from 'react';
import type {Direction} from '@adamantiamud/core';

import useAddRoomLink from '~/hooks/use-add-room-link';
import useRemoveRoomLink from '~/hooks/use-remove-room-link';
import useUpdateRoom from '~/hooks/use-update-room';
import {cast} from '~/utils/fns';

import type {AugmentedRoomExitDef, ExitDirection, RoomNode} from '~/interfaces';

interface ComponentProps {
    direction: ExitDirection;
    room: RoomNode;
}

const useStyles = makeStyles(() => createStyles({
    addIcon: {},
    deleteIcon: {
        marginTop: '1.5rem',
    },
}));

export const AddRemoveExitButton: FC<ComponentProps> = ({direction, room}: ComponentProps) => {
    const {roomDef} = room;

    const classes = useStyles();
    const addRoomLink = useAddRoomLink();
    const removeRoomLink = useRemoveRoomLink();
    const updateRoom = useUpdateRoom();

    const roomExit = useMemo<AugmentedRoomExitDef | null>(
        () => roomDef.exits?.find((exit: AugmentedRoomExitDef) => exit.direction === cast<Direction>(direction)) ?? null,
        [direction, roomDef.exits]
    );

    const addExit = useCallback(
        (): void => {
            const roomLinkId = addRoomLink(room.id, direction);

            updateRoom(produce(room, (draft: Draft<RoomNode>) => {
                draft.roomDef.exits = draft.roomDef.exits ?? [];

                draft.roomDef.exits.push({
                    direction: cast<Direction>(direction),
                    roomId: draft.roomDef.id,
                    roomLinkId: roomLinkId,
                });
            }));
        },
        [
            addRoomLink,
            direction,
            room,
            updateRoom,
        ]
    );

    const removeExit = useCallback(
        (): void => {
            removeRoomLink(roomExit!.roomLinkId);

            updateRoom(produce(room, (draft: Draft<RoomNode>) => {
                draft.roomDef.exits = (draft.roomDef.exits ?? [])
                    .filter((exit: AugmentedRoomExitDef): boolean => exit.direction !== cast<Direction>(direction));
            }));
        },
        [
            direction,
            removeRoomLink,
            room,
            roomExit,
            updateRoom,
        ]
    );

    return (
        <ListItemIcon className={roomExit === null ? classes.addIcon : classes.deleteIcon}>
            {roomExit === null && (
                <IconButton edge="end" aria-label="add" onClick={addExit}>
                    <AddCircleIcon />
                </IconButton>
            )}
            {roomExit !== null && (
                <IconButton edge="end" aria-label="delete" onClick={removeExit}>
                    <DeleteIcon />
                </IconButton>
            )}
        </ListItemIcon>
    );
};

export default AddRemoveExitButton;

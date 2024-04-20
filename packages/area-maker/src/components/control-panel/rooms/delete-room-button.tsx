import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { type FC, useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';

import useRemoveRoom from '~/hooks/use-remove-room';
import { selectedRoomState } from '~/state/rooms-state';

export const DeleteRoomButton: FC = () => {
    const removeRoom = useRemoveRoom();
    const selectedId = useRecoilValue(selectedRoomState);

    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

    const closeDialog = useCallback(
        () => setDialogOpen(false),
        [setDialogOpen]
    );

    const openDialog = useCallback(() => setDialogOpen(true), [setDialogOpen]);

    const handleDelete = useCallback(() => {
        if (selectedId !== '') {
            removeRoom(selectedId);
        }
    }, [removeRoom, selectedId]);

    return (
        <React.Fragment>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={openDialog}
                size="small"
            >
                Delete Room
            </Button>

            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this room? This action
                        cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Never mind
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Delete it!
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default DeleteRoomButton;

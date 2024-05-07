import type { RoomDefinition, RoomExitDefinition } from '@adamantiamud/core';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import type { FC } from 'react';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginBottom: 0,
            marginTop: 0,
            paddingBottom: 0,
            paddingTop: 0,
        },
    })
);

interface ComponentProps {
    room: RoomDefinition;
}

export const RoomExitList: FC<ComponentProps> = ({ room }: ComponentProps) => {
    const classes = useStyles();

    const exits = room.exits;
    if ((exits ?? []).length === 0) {
        return null;
    }

    return (
        <List className={classes.root}>
            {exits!.map((exit: RoomExitDefinition) => (
                <ListItem key={exit.direction} alignItems="flex-start">
                    <ListItemText
                        disableTypography
                        secondary={<Typography>{exit.roomId}</Typography>}
                    >
                        <Typography>{exit.direction}</Typography>
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    );
};

export default RoomExitList;

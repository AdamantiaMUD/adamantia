import type { RoomExitDefinition } from '@adamantiamud/core';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { createStyles, makeStyles } from '@mui/styles';
import type { FC } from 'react';

import { useAreaContext } from '~/context/area-context';

interface ComponentProps {
    roomId: string;
}

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

export const RoomExitList: FC<ComponentProps> = ({
    roomId,
}: ComponentProps) => {
    const classes = useStyles();
    const { rooms } = useAreaContext();

    const exits = rooms[roomId].exits;
    if ((exits ?? []).length === 0) {
        return null;
    }

    return (
        <List className={classes.root}>
            {exits!.map((exit: RoomExitDefinition) => (
                <ListItem key={exit.direction} alignItems="flex-start">
                    <ListItemText
                        disableTypography
                        secondary={
                            <Typography>{rooms[exit.roomId].title}</Typography>
                        }
                    >
                        <Typography>{exit.direction}</Typography>
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    );
};

export default RoomExitList;

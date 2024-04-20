import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles} from '@material-ui/core/styles';

import type {FC} from 'react';

import AddRemoveExitButton from '~/components/control-panel/exits/add-remove-exit-button';
import RoomExitDetails from '~/components/control-panel/exits/room-exit-details';
import {ExitDirection} from '~/interfaces';

import type {RoomNode} from '~/interfaces';

interface ComponentProps {
    room: RoomNode;
}

const useStyles = makeStyles(() => createStyles({
    root: {
        marginBottom: 0,
        marginTop: 0,
        paddingBottom: 0,
        paddingTop: 0,
    },
}));

export const RoomExitList: FC<ComponentProps> = ({room}: ComponentProps) => {
    const classes = useStyles();

    return (
        <List className={classes.root}>
            <ListItem alignItems="flex-start">
                <ListItemText
                    disableTypography
                    secondary={(<RoomExitDetails direction={ExitDirection.NORTH} room={room} />)}
                >
                    <Typography>North</Typography>
                </ListItemText>
                <AddRemoveExitButton direction={ExitDirection.NORTH} room={room} />
            </ListItem>
            <ListItem alignItems="flex-start">
                <ListItemText
                    disableTypography
                    secondary={(<RoomExitDetails direction={ExitDirection.EAST} room={room} />)}
                >
                    <Typography>East</Typography>
                </ListItemText>
                <AddRemoveExitButton direction={ExitDirection.EAST} room={room} />
            </ListItem>
            <ListItem alignItems="flex-start">
                <ListItemText
                    disableTypography
                    secondary={(<RoomExitDetails direction={ExitDirection.SOUTH} room={room} />)}
                >
                    <Typography>South</Typography>
                </ListItemText>
                <AddRemoveExitButton direction={ExitDirection.SOUTH} room={room} />
            </ListItem>
            <ListItem alignItems="flex-start">
                <ListItemText
                    disableTypography
                    secondary={(<RoomExitDetails direction={ExitDirection.WEST} room={room} />)}
                >
                    <Typography>West</Typography>
                </ListItemText>
                <AddRemoveExitButton direction={ExitDirection.WEST} room={room} />
            </ListItem>
        </List>
    );
};

export default RoomExitList;

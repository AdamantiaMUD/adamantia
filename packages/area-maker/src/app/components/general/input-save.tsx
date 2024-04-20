import React from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SaveIcon from '@material-ui/icons/Save';

import type {FC} from 'react';
import type {Theme} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

export const InputSave: FC = () => {
    const classes = useStyles();

    return (
        <Paper component="form" className={classes.root}>
            <InputBase
                className={classes.input}
                placeholder="Search Google Maps"
                inputProps={{'aria-label': 'Edit room title'}}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton color="primary" className={classes.iconButton} aria-label="directions">
                <SaveIcon />
            </IconButton>
        </Paper>
    );
};

export default InputSave;

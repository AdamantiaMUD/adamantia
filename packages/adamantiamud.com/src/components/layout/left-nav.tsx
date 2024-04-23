import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
} from '@mui/material';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

import routes from '~/util/routes';

const drawerWidth = 240;

export const LeftNav: FC = () => (
    <Drawer
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
        }}
        variant="permanent"
        anchor="left"
    >
        <Toolbar />
        <List>
            <ListItem disablePadding>
                <ListItemButton component={Link} to={routes.home}>
                    <ListItemText primary="Home" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to={routes.gettingStarted}>
                    <ListItemText primary="Getting Started" />
                </ListItemButton>
            </ListItem>
            <Box>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to={routes.bundles.core}>
                        <ListItemText primary="Bundles" />
                    </ListItemButton>
                </ListItem>
                <Box sx={{ paddingLeft: '1.5rem' }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            to={routes.bundles.core}
                        >
                            <ListItemText primary="Core Bundles" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            to={routes.bundles.optional}
                        >
                            <ListItemText primary="Optional Bundles" />
                        </ListItemButton>
                    </ListItem>
                </Box>
            </Box>
            <ListItem disablePadding>
                <ListItemButton component={Link} to={routes.releaseNotes}>
                    <ListItemText primary="Release Notes" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to={routes.contributing}>
                    <ListItemText primary="Contributing" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to={routes.licenseCredits}>
                    <ListItemText primary="License/Credits" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to={routes.sourceDocs}>
                    <ListItemText primary="Source Docs" />
                </ListItemButton>
            </ListItem>
        </List>
    </Drawer>
);

export default LeftNav;

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
    useTheme,
} from '@mui/material';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

import Icon from '~/components/general/icon';

export const Header: FC = () => {
    const theme = useTheme();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        AdamantiaMUD
                    </Typography>
                    <IconButton
                        component={Link}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        to="https://github.com/adamantiamud/adamantia-core"
                    >
                        <Icon icon={faGithub} />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;

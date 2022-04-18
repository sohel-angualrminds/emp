import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { Link } from 'react-router-dom'


const pages = [{ text: 'Add Emp', path: "/employees/add" }];

const Navbar = () => {

    return (
        <AppBar position="fixed" sx={{ bgcolor: "green", }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link to="/"
                        style={{ textDecoration: "none", color: "white" }}
                    >
                        <Typography
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'flex', md: 'flex' }, textDecoration: "none" }}
                        >
                            EMS
                        </Typography>
                    </Link>
                    <Box sx={{ justifyContent: 'flex-end', flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Link to={`${page.path}`} key={`${page.path}`}
                                style={{
                                    textDecoration: "none",
                                    color: "white"
                                }}
                            >
                                <Button
                                    key={page.text}
                                    sx={{ my: 2, color: 'white', display: 'block', textDecoration: "none" }}
                                >
                                    {page.text}
                                </Button>
                            </Link>

                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar >
    );
};
export default Navbar;

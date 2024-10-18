import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Box, Slide } from '@mui/material';
import HRSmileLogo from '../assets/HRSmileLogo.png';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAuth } from './auth/AuthContext';

function Sidebar({ mobileOpen, onDrawerToggle }) {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();

    const routes = [
        { path: '/dashboard', name: 'Dashboard' },
        { path: '/holiday', name: 'Holiday' },
        { path: '/policy', name: 'Policy' },
        { path: '/attendance', name: 'Attendance' },
        { path: '/notification', name: 'Notification' },
        { path: '/leave', name: 'Leave' },
        { path: '/expense', name: 'Expense' },
        { path: '/visit', name: 'Visit' },
         { path: '/registration', name: 'Registration' },
    ];

    // Conditionally include the "Employees" tab based on the user's role
    if (user && user.role === 'HR') {
        routes.splice(1, 0, { path: '/employees', name: 'Employees' });
    }

    const drawer = (
        <Box
            sx={{
                width: 240,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                bgcolor: '#084606',
                overflow: 'hidden',
            }}
        >
            {/* Fixed logo area */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                <img src={HRSmileLogo} alt="HRMS Logo" style={{ width: '250px', marginBottom: '20px' }} />
            </Box>

            {/* Scrollable list area without visible scrollbar */}
            <Box sx={{ overflowX: 'auto', flex: 1, '&::-webkit-scrollbar': { display: 'none' },marginTop:'80px' }}>
                <List>
                    {routes.map((route, index) => (
                        <ListItem
                            button
                            key={index}
                            component={Link}
                            to={route.path}
                            sx={{
                                backgroundColor: location.pathname === route.path ? 'white' : 'transparent',
                                color: location.pathname === route.path ? '#084606' : 'white',
                                '&:hover': {
                                    backgroundColor: '#6CF851',
                                    color: 'white',
                                },
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                                borderRadius: '10px',
                            }}
                            onClick={isMobile ? onDrawerToggle : null}
                        >
                            <ListItemText primary={route.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <Slide direction="left" in={mobileOpen} mountOnEnter unmountOnExit>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={onDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 240,
                            zIndex: theme.zIndex.appBar + 1,
                            backgroundColor: '#084606',
                            overflowY: 'hidden',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Slide>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 240,
                        backgroundColor: '#084606',
                        overflowY: 'hidden',
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}

export default Sidebar;

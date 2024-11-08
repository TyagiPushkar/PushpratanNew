import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Box, Slide, Divider, ListItemIcon } from '@mui/material';
import { Dashboard, HolidayVillage, Policy, Notifications, Person, BarChart } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAuth } from './auth/AuthContext';
import HRSmileLogo from '../assets/HRSmileLogo.png';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HowToRegIcon from '@mui/icons-material/HowToReg';
function Sidebar({ mobileOpen, onDrawerToggle }) {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();

    const routes = [
        { path: '/dashboard', name: 'Dashboard', icon: <Dashboard /> },
        { path: '/holiday', name: 'Holiday', icon: <HolidayVillage /> },
        { path: '/policy', name: 'Policy', icon: <Policy /> },
        { path: '/attendance', name: 'Attendance', icon: <BarChart /> },
        { path: '/notification', name: 'Notification', icon: <Notifications /> },
        { path: '/leave', name: 'Leave', icon: <Person /> },
        { path: '/expense', name: 'Expense', icon: <AccountBalanceWalletIcon /> },
        { path: '/visit', name: 'Visit', icon: <AddLocationAltIcon /> },
        { path: '/registration', name: 'Registration', icon: <HowToRegIcon /> },
        { path: '/report', name: 'Report', icon: <SummarizeIcon /> },
    ];

    // Conditionally include the "Employees" tab based on the user's role
    if (user && user.role === 'HR') {
        routes.splice(1, 0, { path: '/employees', name: 'Employees', icon: <Person /> });
    }

    const drawer = (
        <Box
            sx={{
                width: 230,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                bgcolor: '#084606', // Green background color
                overflow: 'hidden',
                boxShadow: 3,
            }}
        >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <img src={HRSmileLogo} alt="HRMS Logo" style={{ width: '180px' }} />
            </Box>

            {/* List */}
            <Box sx={{ overflowY: 'auto', flex: 1, p: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
                <List>
                    {routes.map((route, index) => (
                        <ListItem
                            button
                            key={index}
                            component={Link}
                            to={route.path}
                            selected={location.pathname === route.path}
                           sx={{
                                backgroundColor: location.pathname === route.path ? 'white' : 'transparent',
                                color: location.pathname === route.path ? '#6CF851' : 'white',
                                '&:hover': {
                                    backgroundColor: '#6CF851',
                                    color: 'white',
                                },
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                                borderRadius: '10px',
                            }}
                            onClick={isMobile ? onDrawerToggle : null}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{route.icon}</ListItemIcon>
                            <ListItemText primary={route.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Divider />
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
                            width: 230,
                            bgcolor: '#084606', // Green background color
                            boxShadow: 3,
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
                        width: 230,
                        bgcolor: '#084606', // Green background color
                        boxShadow: 3,
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

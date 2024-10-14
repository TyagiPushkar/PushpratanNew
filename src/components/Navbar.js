import React, { useState } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HRSmileLogo from '../assets/HRSmileLogo.png';

function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        setAnchorEl(null);

    };
    const handlePro = (event) => {
        setAnchorEl(null);
        navigate("/profile");
    };

    const handleNotification = () => {
        navigate("/notification");
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const routes = [
        { path: '/dashboard', name: 'Dashboard' },
        { path: '/employees', name: 'Employees' },
        { path: '/holiday', name: 'Holiday' },
        { path: '/policy', name: 'Policy' },
        { path: '/attendance', name: 'Attendance' },
        { path: '/notification', name: 'Notification' },
        { path: '/leave', name: 'Leave' },
        { path: '/expense', name: 'Expense' },
        { path: '/visit', name: 'Visit' },

    ];

    const drawer = (
        <Box sx={{ width: 240, display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#084606' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                <img src={HRSmileLogo} alt="HRMS Logo" style={{ width: '250px', marginBottom: '20px' }} />
            </Box>
            <List>
                {routes.map((route, index) => (
                    <ListItem
                        button
                        key={index}
                        component={Link}
                        to={route.path}
                        sx={{
                            backgroundColor: location.pathname === route.path ? theme.palette.primary.main : 'transparent',
                            color: location.pathname === route.path ? 'white' : 'white',
                            '&:hover': {
                                backgroundColor: "#084606",
                                color: 'white',
                            },
                        }}
                        onClick={() => setMobileOpen(false)}
                    >
                        <ListItemText primary={route.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" sx={{ bgcolor: '#084606', top: 0 }} style={{ borderRadius: "20px" }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isMobile && (
                            <IconButton color="inherit" onClick={handleDrawerToggle} edge="start">
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                             {user ? user.username : 'Guest'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Typography variant="body1" sx={{ mr: 2 }}>
                            {user ? user.username : 'Guest'}
                        </Typography> */}
                        <IconButton onClick={handleMenu} color="inherit">
                            <Avatar sx={{ bgcolor: 'green' }}>
                                <AccountCircleIcon />
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{
                                sx: { width: 200, mt: 2 },
                            }}
                        >
                            <MenuItem onClick={handlePro}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                        <IconButton color="inherit">
                            <NotificationsIcon onClick={handleNotification} />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
}

export default Navbar;

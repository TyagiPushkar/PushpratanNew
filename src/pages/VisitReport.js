// src/pages/Dealer.js

import React, { useState } from 'react';
import { Box, useMediaQuery, Button } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VisitList from '../components/dealers/VisitList';

function VisitReport() {
    const [isVisitOpen, setIsVisitOpen] = useState(false);
    const [isAddDealerOpen, setIsAddDealerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const drawerWidth = isMobile ? 0 : 240;

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar with fixed width */}
            <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
                <Sidebar />
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Navbar />
                <Box sx={{ mt: 0 }}>
                   <VisitList />
                </Box>
            </Box>
        </Box>
    );
}

export default VisitReport;

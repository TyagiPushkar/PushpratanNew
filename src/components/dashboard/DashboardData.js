import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Grid,
    Divider,
    CircularProgress,
    LinearProgress,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';


const DashboardData = () => {
    const [employeeData, setEmployeeData] = useState(null);
    const [leaveDetails, setLeaveDetails] = useState(null);
    const [expenseDetails, setExpenseDetails] = useState(null);
    const [attendanceDetails, setAttendanceDetails] = useState([]);
    const [assetDetails, setAssetDetails] = useState([]);

    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const EmpId = user.emp_id

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [employeeResponse, leaveResponse, expenseResponse, attendanceResponse, assetResponse] = await Promise.all([
                    axios.get(`https://namami-infotech.com/PushpRatan/src/employee/view_employee.php?EmpId=${EmpId}`),
                    axios.get(`https://namami-infotech.com/PushpRatan/src/leave/balance_leave.php?empid=${EmpId}`),
                    axios.get(`https://namami-infotech.com/PushpRatan/src/expense/get_expense.php?EmpId=${EmpId}`),
                    axios.get(`https://namami-infotech.com/PushpRatan/src/attendance/view_attendance.php?EmpId=${EmpId}`),
                    axios.get(`https://namami-infotech.com/PushpRatan/src/assets/get_issue_asset.php?EmpId=${EmpId}`)
                ]);

                setEmployeeData(employeeResponse.data.data);
                setLeaveDetails(leaveResponse.data.data);
                setExpenseDetails(expenseResponse.data.data);
                setAttendanceDetails(attendanceResponse.data.data);
                setAssetDetails(assetResponse.data.data);
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [EmpId]);


    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    const totalApproved = expenseDetails
        ? expenseDetails.reduce((total, expense) => expense.Status === 'Approved' ? total + parseFloat(expense.expenseAmount) : total, 0)
        : 0;
    const totalPending = expenseDetails
        ? expenseDetails.reduce((total, expense) => expense.Status === null ? total + parseFloat(expense.expenseAmount) : total, 0)
        : 0;

    const totalRejected = expenseDetails
        ? expenseDetails.reduce((total, expense) => expense.Status === 'Rejected' ? total + parseFloat(expense.expenseAmount) : total, 0)
        : 0;

    const totalWorkingHours = attendanceDetails
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort in descending order if necessary
        .slice(0, 7) // Get the most recent 7 entries
        .reduce((total, day) => {
            const hours = parseFloat(day.workingHours);
            return !isNaN(hours) ? total + hours : total; // Only add valid numbers
        }, 0);
    return (
        <Box sx={{ padding: 1 }}>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={2} container justifyContent="center" alignItems="center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%' }}
                    >
                        <Avatar
                            sx={{ width: 100, height: 100 }}
                            src={employeeData.EmailId }
                            alt={employeeData?.name || 'Employee Profile Picture'}
                            style={{ boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }}
                        />
                    </motion.div>
                </Grid>

                <Grid item xs={12} sm={9}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="h5" gutterBottom style={{ color: "#084606" }}>
                            {employeeData?.Name || 'N/A'}'s Dashboard
                        </Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <Typography variant="body1">EmpId: {employeeData?.EmpId || 'N/A'}</Typography>
                                <Typography variant="body1">Email: {employeeData?.EmailId || 'N/A'}</Typography>
                                <Typography variant="body1">Phone: {employeeData?.Mobile || 'N/A'}</Typography>
                            </div>
                            <div>
                                <Typography variant="body1">Name: {employeeData?.Name || 'N/A'}</Typography>
                                <Typography variant="body1">Role: {employeeData?.Designation || 'Employee'}</Typography>
                                <Typography variant="body1">Shift: {employeeData?.Shift || 'N/A'}</Typography>
                            </div>
                            
                        </div>
                    </motion.div>
                </Grid>
            </Grid>
            <Divider sx={{ marginY: 2 }} />
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="fullWidth"
                sx={{ marginBottom: 3 }}
            >
                <Tab label="Leave" />
                <Tab label="Expense" />
                <Tab label="Attendance" />
               

            </Tabs>

            {activeTab === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}

                    style={{ display: "flex", justifyContent: "space-around" }}
                >

                   
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">SL: {leaveDetails?.SL || 0}</Typography>
                        <LinearProgress variant="determinate" value={(leaveDetails?.SL / 12) * 100} sx={{ backgroundColor: "#084606" }} />
                    </Box>
                    
                </motion.div>
            )}
            {activeTab === 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div style={{ display: "flex", justifyContent: "space-around" }}>

                        <Typography variant="body1">Total Approved: ₹{totalApproved.toFixed(2)}</Typography>
                        <Typography variant="body1">Total Rejected: ₹{totalRejected.toFixed(2)}</Typography>
                        <Typography variant="body1">Total Pending: ₹{totalPending.toFixed(2)}</Typography>

                    </div>

                    <Divider sx={{ marginY: 2 }} />

                    <List>
                        {expenseDetails && expenseDetails.map((expense) => (
                            <ListItem key={expense.detailId} sx={{ marginY: 1 }}>
                                <ListItemAvatar>
                                    <Avatar alt="Expense Image" src={expense.image} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${expense.expenseType} - ₹${expense.expenseAmount}`}
                                    secondary={`Date: ${expense.expenseDate} | Status: ${expense.Status}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </motion.div>
            )}
            {activeTab === 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Typography variant="body1" gutterBottom>
                        Total Working Hours in Last 7 days: {totalWorkingHours.toFixed(2)} hours
                    </Typography>

                    <Divider sx={{ marginY: 2 }} />

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>In</TableCell>
                                <TableCell>Out</TableCell>
                                <TableCell>Working Hours</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attendanceDetails
                                ?.sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort in descending order if necessary
                                .slice(0, 7) // Get the most recent 7 entries
                                .map((day, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{day.date}</TableCell>
                                        <TableCell>{day.firstIn}</TableCell>
                                        <TableCell>{day.lastOut}</TableCell>
                                        <TableCell>{day.workingHours} hrs</TableCell>
                                    </TableRow>
                                ))}


                        </TableBody>
                    </Table>
                </motion.div>
            )}


            {activeTab === 3 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Typography variant="h5">Salary Details</Typography>
                    <Typography variant="body1">Salary data will be shown here...</Typography>
                </motion.div>
            )}
            {activeTab === 4 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Table>
                        <TableHead style={{ backgroundColor: "#084606" }}>
                            <TableRow>
                                <TableCell style={{ color: "white" }}>Asset</TableCell>
                                <TableCell style={{ color: "white" }}> Make</TableCell>
                                <TableCell style={{ color: "white" }}> Model</TableCell>
                                <TableCell style={{ color: "white" }}>Serial Number</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assetDetails.map((asset, index) => (
                                <TableRow key={index}>
                                    <TableCell>{asset.asset_name}</TableCell>
                                    <TableCell>{asset.make_name}</TableCell>
                                    <TableCell>{asset.model_name}</TableCell>
                                    <TableCell>{asset.serial_number}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </motion.div>
            )}

        </Box>
    );
};

export default DashboardData;

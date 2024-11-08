import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import axios from 'axios';
import { saveAs } from 'file-saver';
import GetAppIcon from '@mui/icons-material/GetApp';

const AttendanceReport = () => {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredAttendance, setFilteredAttendance] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('https://namami-infotech.com/PushpRatan/src/employee/list_employee.php');
                if (response.data.success) {
                    setEmployees(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        const fetchAttendance = async () => {
            try {
                const response = await axios.get('https://namami-infotech.com/PushpRatan/src/attendance/get_attendance.php');
                if (response.data.success) {
                    setAttendance(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        };

        fetchEmployees();
        fetchAttendance();
    }, []);

    useEffect(() => {
        const filterAttendance = () => {
            const startDate = new Date(fromDate);
            const endDate = new Date(toDate);

            const filtered = attendance.filter((record) => {
                const recordDate = new Date(record.InTime);
                return recordDate >= startDate && recordDate <= endDate;
            });

            setFilteredAttendance(filtered);
        };

        if (fromDate && toDate) {
            filterAttendance();
        }
    }, [fromDate, toDate, attendance]);

    const calculateWorkingHours = (inTime, outTime) => {
        if (!outTime) return 'N/A';
        const inDate = new Date(inTime);
        const outDate = new Date(outTime);
        const diff = Math.abs(outDate - inDate);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const exportAttendanceToCSV = () => {
    const csvData = filteredAttendance.map((record) => {
        const employee = employees.find((emp) => emp.EmpId === record.EmpId);
        const employeeName = employee ? employee.Name : 'N/A';
        const totalWorkingHours = calculateWorkingHours(record.InTime, record.OutTime);

        return {
            EmpId: record.EmpId,
            EmpName: employeeName,
            InTime: `"${new Date(record.InTime).toLocaleString()}"`,  // Wrap date in quotes
            OutTime: record.OutTime ? `"${new Date(record.OutTime).toLocaleString()}"` : '"N/A"', // Wrap date in quotes
            TotalWorkingHours: totalWorkingHours,
        };
    });

    const csvContent = [
        ["EmpId", "EmpName", "In Time", "Out Time", "Total Working Hours"],
        ...csvData.map((row) => Object.values(row)),
    ]
        .map((e) => e.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "attendance_report.csv");
};


    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
                 Attendance Report
            </Typography>

            {/* Date Range Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="From Date"
                    type="date"
                    variant="outlined"
                    size="small"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    sx={{ width: "200px" }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="To Date"
                    type="date"
                    variant="outlined"
                    size="small"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    sx={{ width: "200px" }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" onClick={exportAttendanceToCSV} size="small" style={{ backgroundColor: '#084606' }}>
                      <GetAppIcon />
                </Button>
            </Box>

            {/* Table Display */}
            {/* <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>EmpId</TableCell>
                            <TableCell>EmpName</TableCell>
                            <TableCell>In Time</TableCell>
                            <TableCell>Out Time</TableCell>
                            <TableCell>Total Working Hours</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAttendance.map((record) => {
                            const employee = employees.find((emp) => emp.EmpId === record.EmpId);
                            const employeeName = employee ? employee.Name : 'N/A';
                            const totalWorkingHours = calculateWorkingHours(record.InTime, record.OutTime);

                            return (
                                <TableRow key={record.Id}>
                                    <TableCell>{record.EmpId}</TableCell>
                                    <TableCell>{employeeName}</TableCell>
                                    <TableCell>{new Date(record.InTime).toLocaleString()}</TableCell>
                                    <TableCell>{record.OutTime ? new Date(record.OutTime).toLocaleString() : 'N/A'}</TableCell>
                                    <TableCell>{totalWorkingHours}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer> */}
        </Box>
    );
};

export default AttendanceReport;

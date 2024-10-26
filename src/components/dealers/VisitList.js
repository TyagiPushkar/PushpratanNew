import React, { useEffect, useState } from 'react';
import {
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    TextField,
} from '@mui/material';
import axios from 'axios';

const VisitList = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmpId, setSelectedEmpId] = useState('');
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        // Fetch employee list on component mount
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(
                    'https://namami-infotech.com/PushpRatan/src/employee/list_employee.php'
                );
                if (response.data.success) {
                    setEmployees(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        // Fetch visits only if an employee is selected
        if (selectedEmpId) {
            const fetchVisits = async () => {
                setLoading(true);
                setError('');
                try {
                    const response = await axios.get(
                        `https://namami-infotech.com/PushpRatan/src/visit/get_visits_entry.php?EmpId=${selectedEmpId}`
                    );
                    if (response.data.success) {
                        // Filter visits by the selected date
                        const filteredVisits = selectedDate
                            ? response.data.data.filter((visit) => 
                                new Date(visit.VisitDateTime).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
                              )
                            : response.data.data;

                        setVisits(filteredVisits);
                    } else {
                        setVisits([]);
                        setError(`No visits found for employee ${selectedEmpId}.`);
                    }
                } catch (error) {
                    setError('Error fetching visit history.');
                    setVisits([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchVisits();
        }
    }, [selectedEmpId, selectedDate]);

    const handleEmpChange = (event) => {
        setSelectedEmpId(event.target.value);
        setVisits([]); // Reset visits when a new employee is selected
        setSelectedDate(''); // Reset date when a new employee is selected
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
                Visits Report
            </Typography>

            <FormControl variant="outlined" sx={{ mb: 2, width: "200px" }}>
                <InputLabel>Select Employee</InputLabel>
                <Select
                    value={selectedEmpId}
                    onChange={handleEmpChange}
                    label="Select Employee"
                >
                    {employees.map((employee) => (
                        <MenuItem key={employee.EmpId} value={employee.EmpId}>
                            {employee.Name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Filter by Date"
                type="date"
                variant="outlined"
                value={selectedDate}
                onChange={handleDateChange}
                sx={{ mb: 2, width: "200px" }}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : visits.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead style={{ backgroundColor: '#084606' }}>
                            <TableRow>
                                <TableCell style={{ color: 'white' }}>Visit ID</TableCell>
                                <TableCell style={{ color: 'white' }}>Source </TableCell>
                               
                                <TableCell style={{ color: 'white' }}>Destination </TableCell>
                               
                                <TableCell style={{ color: 'white' }}>Distance (meters)</TableCell>
                                <TableCell style={{ color: 'white' }}>Visit Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visits.map((visit) => (
                                <TableRow key={visit.Id}>
                                    <TableCell>{visit.Id}</TableCell>
                                    <TableCell sx={{color:"orange"}}>
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${visit.SourceLatLong}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                          {visit.SourceTime}
                                        </a>
                                    </TableCell>
                                    <TableCell sx={{color:"orange"}}>
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${visit.DestinationLatLong}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            {visit.DestinationTime}
                                        </a>
                                    </TableCell>
                                    <TableCell>{visit.Distance}</TableCell>
                                    <TableCell>{new Date(visit.VisitDateTime).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>No visits data available. Please select an employee.</Typography>
            )}
        </Box>
    );
};

export default VisitList;

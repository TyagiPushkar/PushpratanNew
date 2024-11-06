// VisitTable.js
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import VisitMap from './VisitMap';

function VisitTable() {
    const [visits, setVisits] = useState([]);
    const { user } = useAuth();
    const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [markers, setMarkers] = useState([]);
    const [directions, setDirections] = useState(null);
    const [distances, setDistances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmpId, setSelectedEmpId] = useState(user.role === 'HR' ? '' : user.emp_id);
    const [showMap, setShowMap] = useState(false); // State to control map visibility

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await axios.get(`https://namami-infotech.com/PushpRatan/src/visit/view_visit.php?empId=${selectedEmpId}`);
                if (response.data.success) {
                    setVisits(response.data.data);
                } else {
                    console.error('Failed to fetch visits');
                }
            } catch (err) {
                console.error('Error fetching visits:', err);
            }
        };
        fetchVisits();
    }, [selectedEmpId]);

    useEffect(() => {
        setMarkers([]);
        setDirections(null);
        setDistances([]);

        const filteredVisits = visits.filter(visit => {
            const visitDate = new Date(visit.VisitTime).toLocaleDateString();
            return visitDate === selectedDate.toLocaleDateString();
        });

        const newMarkers = [];
        const positionCount = {};

        filteredVisits.forEach((visit, index) => {
            const latLong = visit.VisitLatLong.split(',').map(coord => parseFloat(coord.trim()));
            const key = latLong.join(',');

            if (!positionCount[key]) {
                positionCount[key] = 0;
            }
            positionCount[key] += 1;

            const offset = positionCount[key] * 0.0001;
            const markerPosition = {
                lat: latLong[0] + offset,
                lng: latLong[1] + offset,
            };

            newMarkers.push({
                ...markerPosition,
                label: `${String.fromCharCode(65 + index)}`,
            });
        });

        setMarkers(newMarkers);
    }, [selectedDate, visits]);

   useEffect(() => {
    if (window.google && window.google.maps && markers.length > 1) {
        const origin = { lat: markers[0].lat, lng: markers[0].lng };
        const destination = { lat: markers[markers.length - 1].lat, lng: markers[markers.length - 1].lng };
        const waypoints = markers.slice(1, markers.length - 1).map(marker => ({
            location: { lat: marker.lat, lng: marker.lng },
            stopover: true,
        }));

        const service = new window.google.maps.DirectionsService();

        service.route(
            {
                origin,
                destination,
                waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === "OK") {
                    setDirections(response);
                    const totalDistances = response.routes[0].legs.map(leg => leg.distance.text);
                    setDistances(totalDistances);
                } else {
                    console.error('Error calculating directions:', status);
                }
            }
        );
    }
}, [markers]);

    const handleDateChange = (event) => {
        setSelectedDate(new Date(event.target.value));
    };
    useEffect(() => {
    if (user.role === 'HR') {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('https://namami-infotech.com/PushpRatan/src/employee/list_employee.php');
                setEmployees(response.data.data);
            } catch (error) {
                console.log('Error fetching employee list: ' + error.message);
            }
        };
        fetchEmployees();
    }
}, [user.role]);

useEffect(() => {
    if (markers.length > 0) {
        setMapCenter({ lat: markers[0].lat, lng: markers[0].lng });
    }
}, [markers]);

    return (
        <>
            {user.role === 'HR' && (
                <FormControl variant="outlined" sx={{ mb: 2, width: "200px" }}>
                    <InputLabel id="select-empId-label">Select Employee</InputLabel>
                    <Select
                        labelId="select-empId-label"
                        value={selectedEmpId}
                        onChange={(e) => setSelectedEmpId(e.target.value)}
                        label="Select Employee"
                    >
                        {employees.map(employee => (
                            <MenuItem key={employee.EmpId} value={employee.EmpId}>
                                {employee.Name} ({employee.EmpId})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            
            <TextField
                type="date"
                value={selectedDate.toISOString().substr(0, 10)}
                onChange={handleDateChange}
                variant="outlined"
            />
             <br />
            <Button
                variant="contained"
                style={{ backgroundColor: "#084606", color: "white" }}
                onClick={() => setShowMap(!showMap)}
            >
                {showMap ? 'Hide Map' : 'Show Map'}
            </Button>

            <br /> <br />
          
            {showMap && (
                <VisitMap
                    markers={markers}
                    mapCenter={mapCenter}
                    directions={directions}
                    distances={distances}
                />
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead style={{ backgroundColor: "#084606" }}>
                        <TableRow>
                            <TableCell style={{ color: "white" }}>Company Name</TableCell>
                            <TableCell style={{ color: "white" }}> Name</TableCell>
                            <TableCell style={{ color: "white" }}> Mobile</TableCell>
                            <TableCell style={{ color: "white" }}>Visit Time</TableCell>
                                                    </TableRow>
                    </TableHead>
                    <TableBody>
    {visits.filter(visit => {
        const visitDate = new Date(visit.VisitTime).toLocaleDateString();
        return visitDate === selectedDate.toLocaleDateString();
    }).map((visit, index) => (
        <TableRow key={`${visit.DealerID}-${index}`}>
             <TableCell>
                <a
                    href={`https://www.google.com/maps?q=${visit.VisitLatLong}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'blue', textDecoration: 'underline' }}
                >
                   {visit.CompanyName}
                </a>
            </TableCell>
           
            <TableCell>{visit.DealerName}</TableCell>
             <TableCell>{visit.MobileNo}</TableCell>
            <TableCell>{new Date(visit.VisitTime).toLocaleString()}</TableCell>
           
           
        </TableRow>
    ))}
</TableBody>

                </Table>
            </TableContainer>
           
           
        </>
    );
}

export default VisitTable;

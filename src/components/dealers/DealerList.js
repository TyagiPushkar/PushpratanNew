import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
    TableFooter, TablePagination, Button, IconButton
} from '@mui/material';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

import { useAuth } from '../auth/AuthContext';

function DealerList() {
    const { user } = useAuth();
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchDealers = async () => {
            try {
                if (!user || !user.emp_id) {
                    setError('User is not authenticated');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('https://namami-infotech.com/PushpRatan/src/dealer/get_dealers.php', {
                    params: { empId: user.emp_id, role: user.role }
                });

                if (response.data.success) {
                    setDealers(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Error fetching dealer data');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDealers();
    }, [user]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const exportToCsv = () => {
        // Define the CSV header
        const csvRows = [
            ['Dealer ID', 'Dealer Name', 'Address', 'Contact Info', 'Company Name', 'Email']
        ];

        // Populate the CSV rows with dealer data
        dealers.forEach(({ DealerID, DealerName, Address, ContactInfo, CompanyName, MailId }) => {
            csvRows.push([
                DealerID,
                DealerName,
                Address,
                ContactInfo,
                CompanyName,
                MailId
            ]);
        });

        // Convert the array of rows to CSV format
        const csvContent = csvRows.map(row => row.join(',')).join('\n');

        // Create a Blob and link to download the CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'dealers.csv');
        link.click();
        URL.revokeObjectURL(url);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <br />
            <Button
                variant="contained"
                color="primary"
                onClick={exportToCsv}
                style={{ marginBottom: '16px', backgroundColor: "#084606", float: "right" }}
            >
                Export CSV
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead style={{ backgroundColor: "#084606" }}>
                        <TableRow>
                            <TableCell style={{ color: "white" }}>Dealer ID</TableCell>
                             <TableCell style={{ color: "white" }}>Company Name</TableCell>
                            <TableCell style={{ color: "white" }}>Contact Person Name</TableCell>
                            <TableCell style={{ color: "white" }}>Address</TableCell>
                            <TableCell style={{ color: "white" }}>Contact Info</TableCell>
                           
                            <TableCell style={{ color: "white" }}>Email</TableCell>
                            <TableCell style={{ color: "white" }}>Added By</TableCell>
                            {/* {user && user.role === 'HR' && <TableCell style={{ color: "white" }}>Actions</TableCell>} */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dealers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((dealer) => (
                                <TableRow key={dealer.DealerID}>
                                    <TableCell>{dealer.DealerID}</TableCell>
                                    <TableCell>{dealer.CompanyName}</TableCell>
                                    <TableCell>{dealer.DealerName}</TableCell>
                                    <TableCell>{dealer.Address}</TableCell>
                                    <TableCell>{dealer.ContactInfo}</TableCell>
                                    
                                    <TableCell>{dealer.MailId}</TableCell>
                                    <TableCell>{dealer.AddedByName}</TableCell>
                                    {/* {user && user.role === 'HR' && (
                                        <TableCell>
                                            <IconButton
                                                variant="contained"
                                                color="success"
                                                onClick={() => console.log('Approve action for', dealer.DealerID)}
                                            >
                                                <CheckIcon />
                                            </IconButton>
                                            <IconButton
                                                variant="contained"
                                                color="error"
                                                onClick={() => console.log('Reject action for', dealer.DealerID)}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </TableCell>
                                    )} */}
                                </TableRow>
                            ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={dealers.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default DealerList;

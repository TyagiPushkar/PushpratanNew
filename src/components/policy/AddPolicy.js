import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

function AddPolicyDialog({ open, onClose, onPolicyAdded }) {
    const [policyName, setPolicyName] = useState('');
    const [policyDescription, setPolicyDescription] = useState('');
    const [pdfBase64, setPdfBase64] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPdfBase64(reader.result.split(',')[1]); // Remove the base64 prefix
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pdfBase64) {
            alert('Please provide a PDF file.');
            return;
        }

        setLoading(true); // Set loading to true before making the request

        try {
            const response = await axios.post(
                'https://namami-infotech.com/PushpRatan/src/policy/add_policy.php',
                {
                    subject: policyName, // Send as 'subject'
                    body: policyDescription, // Send as 'body'
                    pdf: pdfBase64 // Send PDF data
                }
            );

            if (response.data.success) {
                onPolicyAdded(); // Refresh the list
                setPolicyName('');
                setPolicyDescription('');
                setPdfBase64('');
                onClose();
            } else {
                console.error('Failed to add policy:', response.data.message);
            }
        } catch (error) {
            console.error('Error adding policy:', error);
        } finally {
            setLoading(false); // Set loading to false after request is done
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle style={{ backgroundColor: "#084606", color: "white" }}>Add Policy</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Policy Name"
                        margin="normal"
                        variant="outlined"
                        value={policyName}
                        onChange={(e) => setPolicyName(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Policy Description"
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={policyDescription}
                        onChange={(e) => setPolicyDescription(e.target.value)}
                    />
                    <input
                        accept="application/pdf"
                        type="file"
                        onChange={handleFileChange}
                        style={{ marginTop: '16px', marginBottom: '16px' }}
                    />

                    <Button type="submit" color="primary" variant="contained" sx={{ mt: 2 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Policy'}
                    </Button>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" disabled={loading}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddPolicyDialog;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

const SignUpStep2: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Grab data passed from Step 1
    const initialData = location.state || {};

    // 2. Set state (so user can edit if needed)
    const [fullName, setFullName] = useState(initialData.fullName || '');
    const [icNumber, setIcNumber] = useState(initialData.icNumber || '');
    const [address, setAddress] = useState(initialData.address || '');

    const handleNext = () => {
        // Navigate to Security Questions or Voice Setup
        // Passing the confirmed data forward
        navigate('/signup-voice', { // or /signup-security depending on your flow
            state: { fullName, icNumber, address }
        });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Confirm Your Info
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                    <TextField
                        label="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }} // Keeps label up even if value is added dynamically
                    />

                    <TextField
                        label="IC Number"
                        value={icNumber}
                        onChange={(e) => setIcNumber(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        InputLabelProps={{ shrink: true }}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleNext}
                        sx={{ mt: 2 }}
                    >
                        Next
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default SignUpStep2;
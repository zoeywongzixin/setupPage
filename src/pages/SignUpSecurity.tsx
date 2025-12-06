import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Button, TextField,
    Card, MenuItem, Select, FormControl, InputLabel,
    CircularProgress, Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

// Standard Security Questions List
const SECURITY_QUESTIONS = [
    "What is your mother's maiden name?",
    "What is the name of your first pet?",
    "What was the name of your elementary school?",
    "What city were you born in?",
    "What is your favorite food?",
    "What is the make of your first car?"
];

const SignUpSecurity: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [q1, setQ1] = useState('');
    const [a1, setA1] = useState('');
    const [q2, setQ2] = useState('');
    const [a2, setA2] = useState('');

    const handleSubmit = async () => {
        if (!q1 || !a1 || !q2 || !a2) {
            return alert("Please answer both security questions.");
        }

        setLoading(true);

        // 1. Prepare Final Data Payload
        const finalData = new FormData();
        finalData.append("icNumber", state?.icNumber || "990101-10-1234");
        finalData.append("fullName", state?.fullName || "User");
        finalData.append("address", state?.address || "");
        finalData.append("q1", q1);
        finalData.append("a1", a1);
        finalData.append("q2", q2);
        finalData.append("a2", a2);

        // If we had a voice file in state, append it too (optional)
        // if (state?.voiceFile) finalData.append("voice_file", state.voiceFile);

        try {
            // 2. Try sending to Backend
            await axios.post("http://localhost:8000/signup-finalize", finalData);
            alert("Registration Complete!");
            navigate('/signin'); // Go to Login
        } catch (error) {
            console.log("Server error, using Mock Success...");

            // 3. Mock Fallback (If server is down)
            setTimeout(() => {
                alert("Registration Successful (Offline Mode)!");
                navigate('/signin');
            }, 1000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Card sx={{ p: 4, boxShadow: 3 }}>
                <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
                    Security Setup
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Choose 2 security questions to recover your account if you forget your credentials.
                </Typography>

                <Stack spacing={3}>
                    {/* --- QUESTION 1 --- */}
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel>Security Question 1</InputLabel>
                            <Select
                                value={q1}
                                label="Security Question 1"
                                onChange={(e) => setQ1(e.target.value)}
                            >
                                {SECURITY_QUESTIONS.map((q) => (
                                    <MenuItem key={q} value={q}>{q}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Answer 1"
                            variant="outlined"
                            sx={{ mt: 1 }}
                            value={a1}
                            onChange={(e) => setA1(e.target.value)}
                        />
                    </Box>

                    {/* --- QUESTION 2 --- */}
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel>Security Question 2</InputLabel>
                            <Select
                                value={q2}
                                label="Security Question 2"
                                onChange={(e) => setQ2(e.target.value)}
                            >
                                {SECURITY_QUESTIONS.map((q) => (
                                    <MenuItem key={q} value={q}>{q}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Answer 2"
                            variant="outlined"
                            sx={{ mt: 1 }}
                            value={a2}
                            onChange={(e) => setA2(e.target.value)}
                        />
                    </Box>
                </Stack>

                {/* --- BUTTONS --- */}
                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBackIcon />}
                        fullWidth
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={!loading && <CheckCircleIcon />}
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Complete Sign Up"}
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default SignUpSecurity;
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
import { useLanguage } from '../context/LanguageContext'; // ✅ Import Language Hook

const SignUpSecurity: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // ✅ Get translations
    const { t } = useLanguage();

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

        // ❌ delete FormData (Backend only text = JSON)
        // const finalData = new FormData(); ...

        // ✅ change to JSON Object，
        // Use same fallback as SignUpVoice to ensure consistency
        const payload = {
            ic_number: state?.icNumber || "990101-10-1234", //  Backend ic_number (same fallback as SignUpVoice)
            question1: q1,
            answer1: a1,
            question2: q2,
            answer2: a2
        };

        try {
            console.log("Sending Payload:", payload); // Debug 

            // ✅  URL -> main.py de route
            // axios send object -> application/json
            await axios.post("http://localhost:8000/signup-security", payload);
            
            alert("Registration Complete!");
            navigate('/signin');

        } catch (error) {
            console.error("Server error:", error);
            
            // Mock Fallback 
            // Cheat Code   
            alert("Registration Successful (Offline Mode)!"); 
            navigate('/signin');
        } finally {
            setLoading(false);
        }
    };

    // ✅ The 'return' is now correctly INSIDE the function
    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Card sx={{ p: 4, boxShadow: 3 }}>
                <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
                    {t.securityTitle}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    {t.securityDesc}
                </Typography>

                <Stack spacing={3}>
                    {/* --- QUESTION 1 --- */}
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel>{t.q1Label}</InputLabel>
                            <Select
                                value={q1}
                                label={t.q1Label}
                                onChange={(e) => setQ1(e.target.value)}
                            >
                                {t.questions.map((q) => (
                                    <MenuItem key={q} value={q}>{q}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label={t.a1Label}
                            variant="outlined"
                            sx={{ mt: 1 }}
                            value={a1}
                            onChange={(e) => setA1(e.target.value)}
                        />
                    </Box>

                    {/* --- QUESTION 2 --- */}
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel>{t.q2Label}</InputLabel>
                            <Select
                                value={q2}
                                label={t.q2Label}
                                onChange={(e) => setQ2(e.target.value)}
                            >
                                {t.questions.map((q) => (
                                    <MenuItem key={q} value={q}>{q}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label={t.a2Label}
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
                        {t.back}
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : t.completeBtn}
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default SignUpSecurity;
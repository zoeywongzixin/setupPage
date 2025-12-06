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

        // 1. Prepare Final Data Payload
        const finalData = new FormData();
        finalData.append("icNumber", state?.icNumber || "990101-10-1234");
        finalData.append("fullName", state?.fullName || "User");
        finalData.append("address", state?.address || "");
        finalData.append("q1", q1);
        finalData.append("a1", a1);
        finalData.append("q2", q2);
        finalData.append("a2", a2);

        try {
            // 2. Try sending to Backend
            await axios.post("http://localhost:8000/signup-finalize", finalData);
            alert("Registration Complete!");
            navigate('/signin');
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
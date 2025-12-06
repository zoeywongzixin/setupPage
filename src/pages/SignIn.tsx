import React, { useState } from 'react';
import {
    Button,
    Container,
    Typography,
    Box,
    Card,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VoiceInput from '../components/VoiceInput';
import { checkUserExists } from '../services/api';

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [icNumber, setIcNumber] = useState('');
    const [loginMode, setLoginMode] = useState<'voice' | 'security' | null>(null);
    const [errorPopup, setErrorPopup] = useState(false);
    const [emergencyPopup, setEmergencyPopup] = useState(false); // ✅ NEW
    const [loading, setLoading] = useState(false);

    // --- STEP 1: CHECK USER ---
    const handleCheckUser = async () => {
        if (!icNumber) return;
        setLoading(true);

        const result = await checkUserExists(icNumber);
        setLoading(false);

        if (result.success) {
            setLoginMode(result.mode);
            setStep(2);
        } else {
            setErrorPopup(true);
        }
    };

    // --- STEP 2: VERIFICATION UI ---
    const renderVerification = () => {
        if (loginMode === 'voice') {
            return (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography color="primary" variant="h6">🎤 Voice Verification</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Please say: "My name is [Your Name]"
                    </Typography>

                    <VoiceInput
                        label="Listening..."
                        value=""
                        onChange={() => { }}
                    />
                    <Button variant="contained" sx={{ mt: 2 }}>Verify Voice</Button>
                </Box>
            );
        }

        if (loginMode === 'security') {
            return (
                <Box>
                    <Typography color="secondary" variant="h6">🔐 Security Question</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        What is your mother's maiden name?
                    </Typography>

                    <VoiceInput
                        label="Answer"
                        value=""
                        onChange={() => { }}
                    />
                    <Button variant="contained" sx={{ mt: 2 }} fullWidth>Login</Button>
                </Box>
            );
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Card sx={{ p: 3, boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom align="center">MyKad Login</Typography>

                {/* STEP 1 */}
                {step === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography>Please enter your IC Number to continue:</Typography>

                        <TextField
                            label="IC Number"
                            variant="outlined"
                            fullWidth
                            value={icNumber}
                            onChange={(e) => setIcNumber(e.target.value)}
                            placeholder="e.g. 900101-12-1234"
                        />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleCheckUser}
                            disabled={loading}
                        >
                            {loading ? "Checking..." : "Next"}
                        </Button>

                        {/* ✅ EMERGENCY BUTTON */}
                        <Button
                            variant="contained"
                            color="error"
                            size="large"
                            onClick={() => setEmergencyPopup(true)} // open popup
                        >
                            🚨 Emergency
                        </Button>
                    </Box>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <Box>
                        {renderVerification()}
                        <Button onClick={() => setStep(1)} sx={{ mt: 1 }}>Back</Button>
                    </Box>
                )}
            </Card>

            {/* ❌ USER NOT FOUND POPUP */}
            <Dialog open={errorPopup} onClose={() => setErrorPopup(false)}>
                <DialogTitle sx={{ color: 'red' }}>User Not Found</DialogTitle>
                <DialogContent>
                    <Typography>
                        This IC Number does not exist in our system. Please check again or register a new account.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorPopup(false)}>Close</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/signup-step1')}
                    >
                        Register Now
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 🚨 EMERGENCY CONFIRMATION POPUP */}
            <Dialog open={emergencyPopup} onClose={() => setEmergencyPopup(false)}>
                <DialogTitle sx={{ color: 'red' }}>Emergency Confirmation</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure that you are facing an emergency?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEmergencyPopup(false)}>No</Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => navigate('/emergency')}
                    >
                        Yes, Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SignIn;

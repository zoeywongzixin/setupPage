import React, { useState, useRef } from 'react';
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
    TextField,
    Fab,
    CircularProgress,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VoiceInput from '../components/VoiceInput';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { checkUserExists, verifyVoice, initiateLogin, verifyLogin } from '../services/api';
import { keyframes } from '@emotion/react';

// Pulse Animation for recording
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4); transform: scale(1); }
  50% { box-shadow: 0 0 0 25px rgba(211, 47, 47, 0); transform: scale(1.1); }
  100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); transform: scale(1); }
`;

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [icNumber, setIcNumber] = useState('');
    const [errorPopup, setErrorPopup] = useState(false);
    const [emergencyPopup, setEmergencyPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Voice password state
    const [voiceAttempts, setVoiceAttempts] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [verifyingVoice, setVerifyingVoice] = useState(false);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    
    // Security question state
    const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [verifyingSecurity, setVerifyingSecurity] = useState(false);

    // --- STEP 1: CHECK USER ---
    const handleCheckUser = async () => {
        if (!icNumber) return;
        setLoading(true);

        const result = await checkUserExists(icNumber);
        setLoading(false);

        if (result.success) {
            // Always start with voice password
            setStep(2);
            setVoiceAttempts(0);
            setAudioBlob(null);
            setVoiceError(null);
        } else {
            setErrorPopup(true);
        }
    };

    // Voice recording functions
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setAudioBlob(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setVoiceError(null);
        } catch (err) {
            alert("Microphone access denied. Please allow permissions.");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    // Verify voice password
    const handleVerifyVoice = async () => {
        if (!audioBlob) {
            setVoiceError("Please record your voice first.");
            return;
        }

        if (voiceAttempts >= 3) {
            // Switch to security question
            await loadSecurityQuestion();
            return;
        }

        setVerifyingVoice(true);
        setVoiceError(null);

        const result = await verifyVoice(icNumber, audioBlob);
        setVerifyingVoice(false);

        if (result.success) {
            // Voice verified successfully - proceed to login
            // TODO: Navigate to main page or call login success handler
            alert("Voice verified! Logging in...");
            // navigate('/dashboard'); // or wherever you want to go after login
        } else {
            // Voice verification failed
            const newAttempts = voiceAttempts + 1;
            setVoiceAttempts(newAttempts);
            setAudioBlob(null);
            
            if (newAttempts >= 3) {
                setVoiceError(`Voice verification failed. ${3 - newAttempts} attempts remaining. Switching to security question...`);
                setTimeout(async () => {
                    await loadSecurityQuestion();
                }, 2000);
            } else {
                setVoiceError(`Voice verification failed. ${3 - newAttempts} attempts remaining.`);
            }
        }
    };

    // Load security question
    const loadSecurityQuestion = async () => {
        setLoading(true);
        const result = await initiateLogin(icNumber);
        setLoading(false);
        
        if (result.success && result.question) {
            setSecurityQuestion(result.question);
            setStep(3); // Move to security question step
        } else {
            alert("Error loading security question. Please try again.");
        }
    };

    // Verify security answer
    const handleVerifySecurity = async () => {
        if (!securityAnswer || !securityQuestion) return;

        setVerifyingSecurity(true);
        const result = await verifyLogin(icNumber, securityQuestion, securityAnswer);
        setVerifyingSecurity(false);

        if (result.success) {
            // Security answer correct - proceed to login
            alert("Security answer verified! Logging in...");
            // navigate('/dashboard'); // or wherever you want to go after login
        } else {
            alert("Incorrect answer. Please try again.");
            setSecurityAnswer('');
        }
    };

    // --- STEP 2: VOICE PASSWORD UI ---
    const renderVoicePassword = () => {
        return (
            <Box sx={{ textAlign: 'center' }}>
                <Typography color="primary" variant="h6" gutterBottom>
                    🎤 Voice Password
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Please record your voice password
                </Typography>

                {voiceError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {voiceError}
                    </Alert>
                )}

                {voiceAttempts > 0 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Attempts: {voiceAttempts} / 3
                    </Alert>
                )}

                <Box sx={{ height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Fab
                        color={isRecording ? "error" : "primary"}
                        aria-label="record"
                        onClick={isRecording ? stopRecording : startRecording}
                        sx={{
                            width: 110,
                            height: 110,
                            mb: 2,
                            animation: isRecording ? `${pulse} 1.5s infinite` : 'none',
                            transition: 'all 0.3s ease-in-out'
                        }}
                    >
                        {isRecording ? <StopIcon sx={{ fontSize: 60 }} /> : <MicIcon sx={{ fontSize: 60 }} />}
                    </Fab>

                    <Typography variant="caption" color="text.secondary">
                        {isRecording ? "Listening... Tap to Stop" : audioBlob ? "Recording Saved! Ready to Verify." : "Tap to Start Recording"}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleVerifyVoice}
                    disabled={!audioBlob || verifyingVoice || voiceAttempts >= 3}
                    sx={{ mt: 2 }}
                >
                    {verifyingVoice ? <CircularProgress size={24} color="inherit" /> : "Verify Voice"}
                </Button>
            </Box>
        );
    };

    // --- STEP 3: SECURITY QUESTION UI ---
    const renderSecurityQuestion = () => {
        return (
            <Box>
                <Typography color="secondary" variant="h6" gutterBottom>
                    🔐 Security Question
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Voice verification failed. Please answer your security question.
                </Typography>

                {securityQuestion && (
                    <>
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="body1" fontWeight="bold">
                                {securityQuestion}
                            </Typography>
                        </Box>

                        <VoiceInput
                            label="Answer"
                            value={securityAnswer}
                            onChange={(val) => setSecurityAnswer(val)}
                        />

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleVerifySecurity}
                            disabled={!securityAnswer || verifyingSecurity}
                            sx={{ mt: 2 }}
                        >
                            {verifyingSecurity ? <CircularProgress size={24} color="inherit" /> : "Login"}
                        </Button>
                    </>
                )}
            </Box>
        );
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

                {/* STEP 2: Voice Password */}
                {step === 2 && (
                    <Box>
                        {renderVoicePassword()}
                        <Button onClick={() => setStep(1)} sx={{ mt: 2 }}>Back</Button>
                    </Box>
                )}

                {/* STEP 3: Security Question */}
                {step === 3 && (
                    <Box>
                        {renderSecurityQuestion()}
                        <Button onClick={() => {
                            setStep(2);
                            setSecurityAnswer('');
                            setSecurityQuestion(null);
                        }} sx={{ mt: 2 }}>Back</Button>
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

import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Fab, CircularProgress, Card } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { keyframes } from '@emotion/react';
import axios from 'axios';

// 1. Gemini-style Pulse Animation
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4); transform: scale(1); }
  50% { box-shadow: 0 0 0 25px rgba(211, 47, 47, 0); transform: scale(1.1); }
  100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); transform: scale(1); }
`;

const SignUpVoice: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Fallback data if page is accessed directly
    const fullName = state?.fullName || "User";
    const icNumber = state?.icNumber || "990101-10-1234";

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [uploading, setUploading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
        } catch (err) {
            alert("Microphone access denied. Please allow permissions.");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const handleNext = async () => {
        // Soft check for recording (for testing, we can allow skipping if you want)
        if (!audioBlob) return alert("Please record your voice first.");

        setUploading(true);

        // --- 🚀 BYPASS / MOCK UPLOAD ---
        // If backend is down, we simulate a success after 1 second
        try {
            const formData = new FormData();
            formData.append("voice_file", audioBlob, "voice.wav");
            formData.append("icNumber", icNumber);

            // Try actual upload
            await axios.post("http://localhost:8000/signup-voice", formData);
            alert("Voice saved to server!");
        } catch (error) {
            console.log("Backend offline? Continuing in Mock Mode...");
            // alert("Server offline. Continuing in Offline Mode."); 
        } finally {
            setUploading(false);
            // Navigate to next step (Security Questions)
            // Pass the actual values used (including fallbacks) to ensure consistency
            navigate('/signup-security', { 
                state: {
                    icNumber: icNumber,
                    fullName: fullName,
                    address: state?.address || ""
                }
            });
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>Record Your Voice</Typography>

            <Card sx={{ p: 4, mb: 4, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle1" color="text.secondary">
                    Please read the following aloud:
                </Typography>
                <Typography variant="h6" color="primary" sx={{ my: 2, fontStyle: 'italic', fontWeight: 'bold', lineHeight: 1.4 }}>
                    "My name is {fullName}, and I verify that my IC number is {icNumber}."
                </Typography>
            </Card>

            <Box sx={{ height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* 2. BIG PULSING MIC BUTTON */}
                <Fab
                    color={isRecording ? "error" : "primary"}
                    aria-label="record"
                    onClick={isRecording ? stopRecording : startRecording}
                    sx={{
                        width: 110,
                        height: 110,
                        mb: 2,
                        zIndex: 10,
                        // Apply animation only when recording
                        animation: isRecording ? `${pulse} 1.5s infinite` : 'none',
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    {isRecording ? <StopIcon sx={{ fontSize: 60 }} /> : <MicIcon sx={{ fontSize: 60 }} />}
                </Fab>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {isRecording ? "Listening... Tap to Stop" : audioBlob ? "Recording Saved! Ready to Submit." : "Tap to Start Recording"}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                {/* 3. BACK BUTTON */}
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<ArrowBackIcon />}
                    fullWidth
                    onClick={() => navigate(-1)} // Takes you back to Confirm Info
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!audioBlob || uploading}
                    onClick={handleNext}
                >
                    {uploading ? <CircularProgress size={24} color="inherit" /> : "Next"}
                </Button>
            </Box>
        </Container>
    );
};

export default SignUpVoice;
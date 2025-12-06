import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button, Container, Typography, Box, CircularProgress, Card, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import { extractICData } from '../services/api'; // Commented out for Bypass

const SignUpStep1: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const [frontImg, setFrontImg] = useState<string | null>(null);
    const [backImg, setBackImg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const capture = (setImg: Function) => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) setImg(imageSrc);
    };

    // Reset images to allow retaking
    const handleRetake = () => {
        setFrontImg(null);
        setBackImg(null);
    };

    const handleNext = async () => {
        if (!frontImg || !backImg) return alert("Please capture both sides first.");

        setLoading(true);

        // ---------------------------------------------------------
        // 🚀 FRONTEND BYPASS MODE
        // ---------------------------------------------------------
        setTimeout(() => {
            console.log("⚠️ SKIPPING SERVER: Using Mock Data");

            const mockResult = {
                fullName: "TAN SENG HONG",
                icNumber: "990101-14-5678",
                address: "N277 JALAN PERKASA 1 TAMAN MALURI, 55100, KUALA LUMPUR"
            };

            setLoading(false);

            navigate('/signup-step2', {
                state: {
                    icNumber: mockResult.icNumber,
                    fullName: mockResult.fullName,
                    address: mockResult.address, // Optional: Pass image to next step if needed
                }
            });

        }, 1000);
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{ my: 2, textAlign: 'center' }}>Scan MyKad</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                {/* 1. WEBCAM VIEW (Only shows if images are missing) */}
                {!frontImg || !backImg ? (
                    <Box sx={{ border: '2px solid #ccc', borderRadius: 2, overflow: 'hidden' }}>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            videoConstraints={{ facingMode: "environment" }} // Use back camera on mobile
                        />
                    </Box>
                ) : null}

                {/* 2. PREVIEW CAPTURED IMAGES */}
                {frontImg && (
                    <Card sx={{ display: 'flex', p: 1, alignItems: 'center', gap: 2 }}>
                        <CardMedia component="img" image={frontImg} sx={{ width: 80, height: 50, borderRadius: 1 }} />
                        <Typography variant="body2">Front IC Captured</Typography>
                    </Card>
                )}
                {backImg && (
                    <Card sx={{ display: 'flex', p: 1, alignItems: 'center', gap: 2 }}>
                        <CardMedia component="img" image={backImg} sx={{ width: 80, height: 50, borderRadius: 1 }} />
                        <Typography variant="body2">Back IC Captured</Typography>
                    </Card>
                )}

                {/* 3. BUTTONS AREA */}

                {/* Capture Front */}
                {!frontImg && (
                    <Button variant="contained" size="large" onClick={() => capture(setFrontImg)}>
                        Capture Front
                    </Button>
                )}

                {/* Capture Back */}
                {frontImg && !backImg && (
                    <Button variant="contained" size="large" onClick={() => capture(setBackImg)}>
                        Capture Back
                    </Button>
                )}

                {/* Final Actions: Retake OR Process */}
                {frontImg && backImg && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={handleRetake}
                            disabled={loading}
                        >
                            Retake
                        </Button>

                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            onClick={handleNext}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Process & Next"}
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default SignUpStep1;
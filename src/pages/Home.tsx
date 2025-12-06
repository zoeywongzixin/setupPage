import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext"; // ✅ 1. Import the custom Hook

const Home: React.FC = () => {
    const navigate = useNavigate();

    // ✅ 2. Use the Hook instead of useContext
    // This gives you 'language' (state) and 'toggleLanguage' (function)
    const { language, toggleLanguage } = useLanguage();

    return (
        <Box textAlign="center" mt={5}>
            {/* ✅ 3. FIX CASE: Use lowercase "bm" to match the Context type */}
            <Typography variant="h3">
                {language === "bm" ? "Selamat Datang" : "Welcome"}
            </Typography>

            <Box mt={3}>
                <Button variant="contained" onClick={() => navigate("/signup-step1")}>
                    {language === "bm" ? "Daftar" : "Sign Up"}
                </Button>
                <Button variant="contained" sx={{ ml: 2 }} onClick={() => navigate("/signin")}>
                    {language === "bm" ? "Log Masuk" : "Sign In"}
                </Button>
            </Box>

            <Box mt={3}>
                {/* ✅ 4. Use toggleLanguage function for cleaner logic */}
                <Button onClick={toggleLanguage}>
                    {language === "bm" ? "Switch to English" : "Tukar ke Bahasa Malaysia"}
                </Button>
            </Box>
        </Box>
    );
};

export default Home;
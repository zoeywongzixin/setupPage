import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext"; // ✅ Use the hook

const UserMode: React.FC = () => {
    const navigate = useNavigate();

    // ✅ Get 'language' and 't' from the global hook
    const { language, t } = useLanguage();

    // ✅ Define local translations matching 'en' and 'bm' keys
    const localTranslations = {
        en: {
            title: "Select User Mode",
            normal: "Normal",
            rural: "Rural Area",
            easy: "Easy Mode",
            senior: "Senior Citizen"
        },
        bm: {
            title: "Pilih Mod Pengguna",
            normal: "Biasa",
            rural: "Luar Bandar",
            easy: "Mod Mudah",
            senior: "Warga Emas"
        }
    };

    // Helper to get text based on current language
    const text = localTranslations[language];

    const handleSelect = (mode: string) => {
        // Logic to save mode
        console.log("Selected:", mode);
        navigate('/signup-step1');
    };

    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h4">{text.title}</Typography>

            <Box display="flex" justifyContent="center" gap={2} mt={2}>
                <Button variant="contained" onClick={() => handleSelect("normal")}>
                    {text.normal}
                </Button>
                <Button variant="contained" onClick={() => handleSelect("rural")}>
                    {text.rural}
                </Button>
                <Button variant="contained" onClick={() => handleSelect("easy")}>
                    {text.easy}
                </Button>
                <Button variant="contained" onClick={() => handleSelect("senior")}>
                    {text.senior}
                </Button>
            </Box>
        </Box>
    );
};

export default UserMode;
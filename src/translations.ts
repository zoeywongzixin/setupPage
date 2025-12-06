export const translations = {
    en: {
        // Common
        next: "Next",
        back: "Back",
        loading: "Loading...",
        process: "Process & Next",
        retake: "Retake",
        error: "Error",

        // SignIn
        loginTitle: "MyKad Login",
        icLabel: "IC Number",
        passwordLabel: "Password",
        loginBtn: "Login",
        registerNow: "Register Now",
        userNotFound: "User Not Found",
        userNotFoundDesc: "This IC Number does not exist. Please register.",

        // SignUp Step 1 (Scan)
        scanTitle: "Scan MyKad",
        captureFront: "Capture Front",
        captureBack: "Capture Back",
        captureError: "Please capture both sides",

        // SignUp Step 2 (Confirm)
        confirmTitle: "Confirm Your Info",
        fullName: "Full Name",
        address: "Address",

        // Voice
        voiceTitle: "Record Your Voice",
        readAloud: "Please read the following aloud:",
        voiceSentence: (name: string, ic: string) => `My name is ${name}, and I verify that my IC number is ${ic}.`,
        startRecord: "Tap to Record",
        stopRecord: "Stop Recording",

        // Security
        securityTitle: "Security Setup",
        securityDesc: "Choose 2 questions to secure your account.",
        q1Label: "Security Question 1",
        a1Label: "Answer 1",
        q2Label: "Security Question 2",
        a2Label: "Answer 2",
        completeBtn: "Complete Registration",
        questions: [
            "What is your mother's maiden name?",
            "What is the name of your first pet?",
            "What was the name of your elementary school?",
            "What city were you born in?"
        ]
    },
    bm: {
        // Common
        next: "Seterusnya",
        back: "Kembali",
        loading: "Memproses...",
        process: "Proses & Lanjut",
        retake: "Tangkap Semula",
        error: "Ralat",

        // SignIn
        loginTitle: "Log Masuk MyKad",
        icLabel: "Nombor KP",
        passwordLabel: "Kata Laluan",
        loginBtn: "Log Masuk",
        registerNow: "Daftar Sekarang",
        userNotFound: "Pengguna Tidak Ditemui",
        userNotFoundDesc: "Nombor KP ini tiada dalam sistem. Sila daftar.",

        // SignUp Step 1 (Scan)
        scanTitle: "Imbas MyKad",
        captureFront: "Tangkap Depan",
        captureBack: "Tangkap Belakang",
        captureError: "Sila tangkap kedua-dua belah",

        // SignUp Step 2 (Confirm)
        confirmTitle: "Sahkan Maklumat",
        fullName: "Nama Penuh",
        address: "Alamat",

        // Voice
        voiceTitle: "Rekod Suara Anda",
        readAloud: "Sila baca ayat berikut dengan kuat:",
        voiceSentence: (name: string, ic: string) => `Nama saya ${name}, dan saya sahkan nombor kad pengenalan saya ialah ${ic}.`,
        startRecord: "Tekan untuk Rekod",
        stopRecord: "Berhenti Rekod",

        // Security
        securityTitle: "Tetapan Keselamatan",
        securityDesc: "Pilih 2 soalan untuk keselamatan akaun anda.",
        q1Label: "Soalan Keselamatan 1",
        a1Label: "Jawapan 1",
        q2Label: "Soalan Keselamatan 2",
        a2Label: "Jawapan 2",
        completeBtn: "Selesai Pendaftaran",
        questions: [
            "Apakah nama ibu kandung anda?",
            "Apakah nama haiwan peliharaan pertama anda?",
            "Apakah nama sekolah rendah anda?",
            "Di manakah bandar kelahiran anda?"
        ]
    }
};
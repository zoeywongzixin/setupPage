from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import json
import random
import uuid

app = FastAPI()

# 1. CORS Setup
origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. DATABASE SETUP
DB_FILE = "users.json"
users_db = {}

if os.path.exists(DB_FILE):
    try:
        with open(DB_FILE, "r") as f:
            users_db = json.load(f)
        print(f"✅ Loaded {len(users_db)} users.")
    except:
        print("⚠️ Database empty.")


def save_db():
    with open(DB_FILE, "w") as f:
        json.dump(users_db, f, indent=4)

# --- 🛠️ HELPER: CLEAN IC NUMBER ---
# Removes '-' and ' ' so 990101-10-1234 becomes 990101101234


def clean_ic(ic_str: str):
    return ic_str.replace("-", "").replace(" ", "").strip()


# Ensure folders exist
os.makedirs("voices", exist_ok=True)

# --- ROUTES ---


@app.post("/api/ocr/extract")
async def extract_ocr(front_image: UploadFile = File(...), back_image: UploadFile = File(...)):
    # Mock Response
    return {
        "success": True,
        "icNumber": "990101-14-5678",
        "fullName": "TAN SENG HONG",
        "address": "NO 1, JALAN TEST, KUALA LUMPUR"
    }


@app.post("/signup-voice")
async def save_user_voice(icNumber: str = Form(...), voice_file: UploadFile = File(...)):
    # Clean the IC before using it
    user_id = clean_ic(icNumber)

    file_location = f"voices/{user_id}.wav"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(voice_file.file, buffer)

    if user_id not in users_db:
        users_db[user_id] = {}

    users_db[user_id]["voice_path"] = file_location
    save_db()
    return {"success": True}


@app.post("/signup-finalize")
async def signup_finalize(
    icNumber: str = Form(...),
    fullName: str = Form(...),
    address: str = Form(...),
    q1: str = Form(...),
    a1: str = Form(...),
    q2: str = Form(...),
    a2: str = Form(...)
):
    # Clean the IC before saving
    user_id = clean_ic(icNumber)

    if user_id not in users_db:
        users_db[user_id] = {}

    users_db[user_id].update({
        "fullName": fullName,
        "address": address,
        "security_questions": [
            {"question": q1, "answer": a1},
            {"question": q2, "answer": a2}
        ],
        "mode": "security"
    })

    print(f"✅ REGISTERED USER: {user_id}")  # Debug Print
    save_db()
    return {"status": "User Registered", "user": users_db[user_id]}


@app.post("/login/check-user")
async def check_user(icNumber: str = Form(...)):
    # Clean the input before checking
    user_id = clean_ic(icNumber)
    user = users_db.get(user_id)

    if not user:
        print(f"❌ Login Failed: {user_id} not found in DB.")
        return {"success": False, "message": "User not found"}

    print(f"✅ User Found: {user_id}")
    return {
        "success": True,
        "mode": user.get("mode", "security"),
        "fullName": user.get("fullName")
    }


@app.post("/login/initiate")
async def login_initiate(icNumber: str = Form(...)):
    user_id = clean_ic(icNumber)
    user = users_db.get(user_id)
    if not user:
        return {"success": False, "message": "User not found"}

    questions = user.get("security_questions", [])
    if not questions:
        return {"success": False, "message": "No questions set"}

    selected = random.choice(questions)
    return {"success": True, "question": selected["question"]}


@app.post("/login/verify-voice")
async def verify_voice(icNumber: str = Form(...), voice_file: UploadFile = File(...)):
    """Verify user's voice password during login"""
    user_id = clean_ic(icNumber)
    user = users_db.get(user_id)
    
    if not user:
        return {"success": False, "message": "User not found"}
    
    stored_voice_path = user.get("voice_path")
    if not stored_voice_path:
        return {"success": False, "message": "No voice registered"}
    
    # For now, we'll do a simple file comparison
    # In production, you'd use voice recognition/ML to compare voices
    # This is a placeholder - you can implement actual voice verification later
    temp_path = f"voices/temp_{user_id}_{uuid.uuid4()}.wav"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(voice_file.file, buffer)
    
    # TODO: Implement actual voice verification using ML/voice recognition
    # For now, we'll accept any voice file (you should replace this with real verification)
    # This is a mock implementation
    os.remove(temp_path)  # Clean up temp file
    
    # Mock verification - in production, compare voices using ML
    return {"success": True, "message": "Voice verified"}


@app.post("/login/verify")
async def login_verify(
    icNumber: str = Form(...),
    question: str = Form(...),
    answer: str = Form(...)
):
    user_id = clean_ic(icNumber)
    user = users_db.get(user_id)
    if not user:
        return {"success": False}

    stored_pair = next(
        (q for q in user["security_questions"] if q["question"] == question), None)

    if stored_pair and stored_pair["answer"].strip().lower() == answer.strip().lower():
        return {"success": True, "user": user}
    else:
        return {"success": False, "message": "Incorrect Answer"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SDG Project Management System", version="1.0.0")

# CORS Middleware
origins = [
    "http://localhost:5173",  # React default port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the SDG Project Management API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

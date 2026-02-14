from pydantic import BaseModel, EmailStr
from typing import Optional, List
from app.models.user import UserRole, FacultyProfile, StudentProfile

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole
    # For simplicity, passing profile data as generic dict or specific structure
    faculty_profile: Optional[FacultyProfile] = None
    student_profile: Optional[StudentProfile] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str # PydanticObjectId
    email: EmailStr
    full_name: str
    role: UserRole
    faculty_profile: Optional[FacultyProfile] = None
    student_profile: Optional[StudentProfile] = None

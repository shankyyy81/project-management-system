from beanie import Document, Link
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime
from .user import User

class ProjectStatus(str, Enum):
    ON_TRACK = "On Track"
    DELAYED = "Delayed"
    COMPLETED = "Completed"

class Team(BaseModel):
    name: str = "Team A"
    leader: Link[User]  # Reference to Student
    members: List[Link[User]] = [] # References to Students

class Project(Document):
    title: str
    problem_statement: str
    status: ProjectStatus = ProjectStatus.ON_TRACK
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Owner
    faculty: Link[User] 
    
    # Assignment
    team: Optional[Team] = None
    
    # Analysis
    sdg_mapping: Dict[str, str] = {} # e.g. {"SDG 4": "Quality Education"}
    ml_confidence_scores: Dict[str, float] = {}

    class Settings:
        name = "projects"

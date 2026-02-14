from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Annotated
from beanie import PydanticObjectId

from app.routes.auth import get_current_user
from app.models.user import User, UserRole
from app.models.project import Project, ProjectStatus

router = APIRouter()

@router.post("/", response_model=Project)
async def create_project(
    project_in: Project,
    current_user: Annotated[User, Depends(get_current_user)]
):
    # 1. Check Role
    if current_user.role != UserRole.FACULTY:
        raise HTTPException(status_code=403, detail="Only Faculty can create projects")
    
    # 2. Check Constraint (Max 5 Active Projects)
    active_count = await Project.find(
        Project.faculty.id == current_user.id,
        Project.status != ProjectStatus.COMPLETED
    ).count()
    
    if active_count >= 5:
        raise HTTPException(
            status_code=403, 
            detail="Faculty cannot supervise more than 5 active projects."
        )
    
    # 3. Create Project
    project_in.faculty = current_user
    await project_in.insert()
    return project_in

@router.get("/", response_model=List[Project])
async def list_projects(
    current_user: Annotated[User, Depends(get_current_user)]
):
    # For now, return all projects. Filter logic can be added later.
    projects = await Project.find_all().to_list()
    return projects

@router.get("/my-projects", response_model=List[Project])
async def list_my_projects(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.role == UserRole.FACULTY:
        projects = await Project.find(Project.faculty.id == current_user.id).to_list()
    else:
        # Check if student is in the team.members list or is the leader
        # Since we use Link, we might need to query carefully.
        # Simple approach: Find projects where team.leader.id == user.id OR team.members.id == user.id
        # Beanie's query syntax for Links can be tricky, simplified check:
        
        # 1. Find projects where they are leader
        projects_leader = await Project.find(Project.team.leader.id == current_user.id).to_list()
        
        # 2. Find projects where they are a member
        # Note: This query depends on how Beanie handles List[Link]. 
        # Often easier to fetch all projects with teams and filter efficiently if dataset is small, 
        # or use specific MongoDB query operator.
        # For this MVP/Prototype with small data:
        all_projects = await Project.find({'team': {'$ne': None}}).to_list()
        
        projects_member = []
        for p in all_projects:
            if p.team and p.team.members:
                for m in p.team.members:
                    if m.ref.id == current_user.id:
                        projects_member.append(p)
                        break
        
        # Merge and deduplicate
        projects = list({p.id: p for p in (projects_leader + projects_member)}.values())
        
    return projects

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

class AnalysisRequest(BaseModel):
    problem_statement: str

class SdgSuggestion(BaseModel):
    sdg: str
    confidence: float

class AnalysisResponse(BaseModel):
    suggestions: List[SdgSuggestion]
    model_name: str = "SDG-BERT-Mock"

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_problem_statement(request: AnalysisRequest):
    # MOCK LOGIC: 
    # In production, this would call the loaded SDG-BERT model.
    # Here we return deterministic mock data based on keywords for demo purposes.
    
    text = request.problem_statement.lower()
    suggestions = []
    
    if "education" in text or "school" in text or "teach" in text:
        suggestions.append(SdgSuggestion(sdg="SDG 4: Quality Education", confidence=0.92))
    elif "health" in text or "doctor" in text or "medicine" in text:
        suggestions.append(SdgSuggestion(sdg="SDG 3: Good Health and Well-being", confidence=0.88))
    elif "water" in text or "sanitation" in text:
        suggestions.append(SdgSuggestion(sdg="SDG 6: Clean Water and Sanitation", confidence=0.95))
    else:
        # Default fallback
        suggestions.append(SdgSuggestion(sdg="SDG 9: Industry, Innovation and Infrastructure", confidence=0.65))
        suggestions.append(SdgSuggestion(sdg="SDG 11: Sustainable Cities and Communities", confidence=0.45))
        
    return AnalysisResponse(suggestions=suggestions)

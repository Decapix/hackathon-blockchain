from pydantic import BaseModel
from typing import Optional


class ExamSession(BaseModel):
    email: str
    exam_id: int
    timestamp: int
    session_id: str

class ExamResultRequest(BaseModel):
    email: str
    exam_id: int
    score: int
    cheat_score: float
    passed: bool
    details: Optional[dict] = None

class Exam(ExamSession, ExamResultRequest):
    pass

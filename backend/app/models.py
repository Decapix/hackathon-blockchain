from pydantic import BaseModel
from typing import Optional

class UserModel(BaseModel):
    username: str
    emailgoogle: str
    address_wallet: str

    class Config:
        schema_extra = {
            "example": {
                "username": "johndoe",
                "emailgoogle": "johndoe@gmail.com",
                "address_wallet": "0x123456789abcdef"
            }
        }

class ExamRequest(BaseModel):
    email: str
    exam_id: int

class ExamSession(BaseModel):
    email: str
    exam_id: int
    timestamp: int
    session_id: str

class ExamResultRequest(BaseModel):
    email: str
    exam_id: int
    score: int
    cheat_score: float  # Score de détection de triche (0-1)
    passed: bool
    details: Optional[dict] = None

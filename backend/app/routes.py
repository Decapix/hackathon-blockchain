
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from tinydb import TinyDB, Query
import time

router = APIRouter()

db = TinyDB('db.json')
ExamTable = db.table('exam')

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

class ExamInitRequest(BaseModel):
    email: str
    exam_id: int

@router.post("/init_exam")
def init_exam(request: ExamInitRequest):
    session_id = f"{request.email}-{request.exam_id}-{int(time.time())}"
    exam_session = ExamSession(
        email=request.email,
        exam_id=request.exam_id,
        timestamp=int(time.time()),
        session_id=session_id
    )
    ExamTable.insert(exam_session.dict())
    return {"session_id": session_id}

@router.post("/update_exam")
def update_exam(request: ExamResultRequest):
    Exam = Query()
    existing_exam = ExamTable.search((Exam.email == request.email) & (Exam.exam_id == request.exam_id))
    if not existing_exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    ExamTable.update(request.dict(), (Exam.email == request.email) & (Exam.exam_id == request.exam_id))
    return {"message": "Exam updated"}

@router.get("/get_last_exam/{email}")
def get_last_exam(email: str):
    Exam = Query()
    last_exam = sorted(ExamTable.search(Exam.email == email), key=lambda x: x['timestamp'], reverse=True)
    if not last_exam:
        raise HTTPException(status_code=404, detail="No exams found")
    return last_exam[0]

@router.get("/get_result")
def get_result(email: str, exam_id: int):
    Exam = Query()
    result = ExamTable.search((Exam.email == email) & (Exam.exam_id == exam_id))
    if not result:
        raise HTTPException(status_code=404, detail="Exam not found")
    return result[0]


@router.get("/get_last_exam_global")
def get_last_exam_global():
    all_exams = ExamTable.all()
    if not all_exams:
        raise HTTPException(status_code=404, detail="No exams found")
    last_exam = max(all_exams, key=lambda x: x['timestamp'])
    return last_exam

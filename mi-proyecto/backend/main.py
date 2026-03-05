from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, database
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Esquema para recibir datos
class UserAuth(BaseModel):
    user: str
    email: str = None
    pass_word: str # usamos pass_word porque 'pass' es palabra reservada en python

@app.post("/register")
def register(data: UserAuth, db: Session = Depends(database.get_db)):
    db_user = models.User(username=data.user, email=data.email, password=data.pass_word)
    db.add(db_user)
    db.commit()
    return {"status": "success"}

@app.post("/login")
def login(data: UserAuth, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == data.user).first()
    if not user or user.password != data.pass_word:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    return {"status": "success", "username": user.username}
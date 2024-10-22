from typing import List, Union
from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from pydantic import BaseModel

app = FastAPI()

### Database Connection

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

### Normal Youtube API
# 1. Retrieve 12 videos from Youtube API and return them as a list (Requirement 2)

### Keywords API
# Keyword table in the database
class Keyword(Base):
    __tablename__ = "keywords"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

# Format of the input JSON for creating a new keyword
class KeywordCreate(BaseModel):
    name: str

# Format of the output JSON for getting a keyword from the database
class KeywordResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

# 1. Retrieve keywords from database and return them as a list (Requirement 5)
# 2. Call Youtube API to return a list of videos based on the keywords (Requirement 5)
# 3. Default Keywords should be - "AI", "Software Development", "Debugging", "Testing", "Workflow", "Documentation", "Learning", "Tools", "Automation", then
# return them as a list (Requirement 6)
# 4. Allow user to add new keywords to the database (Requirement 7)
@app.post("/keywords/", response_model=KeywordResponse)
def create_keyword(keyword: KeywordCreate, db: Session = Depends(get_db)):
    db_keyword = Keyword(name=keyword.name)  # Create a Keyword instance
    db.add(db_keyword)
    db.commit()
    db.refresh(db_keyword)
    return db_keyword

@app.get("/keywords/", response_model=List[KeywordResponse])
def read_keywords(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    keywords = db.query(Keyword).offset(skip).limit(limit).all()
    return keywords
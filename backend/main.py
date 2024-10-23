from http.client import HTTPException
from typing import List
from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

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
youtube_endpoint = "https://www.googleapis.com/youtube/v3/search"

# Function to call YouTube API
def search_youtube(query: str, max_results: int = 12):
    params = {
        'part': 'snippet',
        'q': query,
        'maxResults': max_results,
        'key': YOUTUBE_API_KEY
    }
    
    response = requests.get(youtube_endpoint, params=params)
    
    # Check for API errors
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error fetching data from YouTube API")
    
    return response.json()

@app.get("/get_videos/")
def get_youtube_videos(query: str):
    """
    Fetch YouTube videos based on a search query and return the results.
    """
    try:
        youtube_response = search_youtube(query)
        # videos = []
        # for item in youtube_response.get('items', []):
        #     video_data = {
        #         'title': item['snippet']['title'],
        #         'description': item['snippet']['description'],
        #         'thumbnail': item['snippet']['thumbnails']['default']['url'],
        #         'videoId': item['id'].get('videoId', None)
        #     }
        #     videos.append(video_data)

        # return {"videos": videos}
        return youtube_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

## API Endpoints
# 1. Retrieve keywords from database and return them as a list (Requirement 5)
@app.get("/keywords/", response_model=List[KeywordResponse])
def read_keywords(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    keywords = db.query(Keyword).offset(skip).limit(limit).all()
    return keywords

# 2. Call Youtube API to return a list of videos based on the keywords (Requirement 5)


# 3. Default Keywords should be - "AI", "Software Development", "Debugging", "Testing", "Workflow", "Documentation", "Learning", "Tools", "Automation", then
# return them as a list (Requirement 6)
@app.get("/get_videos_default_keywords/")
def get_default_keywords_videos():
    # default_keywords = ["AI", "Software Development", "Debugging", "Testing", "Workflow", "Documentation", "Learning", "Tools", "Automation"]
    # videos = []
    # for keyword in default_keywords:
    #     youtube_response = search_youtube(keyword)
    #     for item in youtube_response.get('items', []):
    #         video_data = {
    #             'title': item['snippet']['title'],
    #             'description': item['snippet']['description'],
    #             'thumbnail': item['snippet']['thumbnails']['default']['url'],
    #             'videoId': item['id'].get('videoId', None)
    #         }
    #         videos.append(video_data)
    default_keywords = "Workflow+Code+Assistant+AI+Software+Development+Debugging+Testing+Documentation+Learning+Tools+Automation"
    
    return get_youtube_videos(default_keywords)

# 4. Allow user to add new keywords to the database (Requirement 7)
@app.post("/keywords/", response_model=KeywordResponse)
def create_keyword(keyword: KeywordCreate, db: Session = Depends(get_db)):
    db_keyword = Keyword(name=keyword.name)  # Create a Keyword instance
    db.add(db_keyword)
    db.commit()
    db.refresh(db_keyword)
    return db_keyword

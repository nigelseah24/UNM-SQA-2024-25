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
from fastapi.middleware.cors import CORSMiddleware

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
        
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or use ["*"] to allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

### Normal Youtube API
# 1. Retrieve videos from Youtube API and return them as a list (Requirement 2)
youtube_search_video_endpoint = "https://www.googleapis.com/youtube/v3/search"
# Function to call YouTube API
def search_youtube(query: str):
    params = {
        'part': 'snippet',
        'q': query,
        'maxResults': 12,
        'key': YOUTUBE_API_KEY
    }
    
    response = requests.get(youtube_search_video_endpoint, params=params)
    
    # Check for API errors
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error fetching data from YouTube API")
    
    return response.json()

# 2. Get video data from Youtube API 
youtube_video_data_endpoint = "https://www.googleapis.com/youtube/v3/videos"
def get_video_data(video_ids: List[str]):
    params = {
        'part': 'snippet,statistics,contentDetails',
        'id': ','.join(video_ids),
        'key': YOUTUBE_API_KEY
    }
    
    response = requests.get(youtube_video_data_endpoint, params=params)
    
    # Check for API errors
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error fetching data from YouTube API")
    
    return response.json()

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
@app.get("/get_videos/")
def get_youtube_videos(query: str):
    """
    Fetch YouTube videos based on a search query and return the results.
    """
    try:
        # Call the search_youtube function to retrieve video IDs
        youtube_response = search_youtube(query)
        print(youtube_response)
        video_ids = [item['id']['videoId'] for item in youtube_response.get('items', []) if 'videoId' in item['id']]

        # Ensure only 12 video IDs are retrieved
        video_ids = video_ids[:12]
        
        # Call the get_video_data function with the video IDs
        video_data_response = get_video_data(video_ids)
        
        videos = []
        for item in video_data_response.get('items', []):
            video_data = {
                'title': item['snippet']['title'],
                'description': item['snippet']['description'],
                'thumbnail': item['snippet']['thumbnails']['high']['url'],
                'channelTitle': item['snippet']['channelTitle'],
                'publishedAt': item['snippet']['publishedAt'],
                'viewCount': item['statistics']['viewCount'],
                'likeCount': item['statistics']['likeCount'],
                'duration': item['contentDetails']['duration'],
            }
            videos.append(video_data)

        print(f"Final video count: {len(videos)}")
        return {"items": videos}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 3. Allow user to add new keywords to the database (Requirement 7)
@app.post("/keywords/", response_model=KeywordResponse)
def create_keyword(keyword: KeywordCreate, db: Session = Depends(get_db)):
    db_keyword = Keyword(name=keyword.name)  # Create a Keyword instance
    db.add(db_keyword)
    db.commit()
    db.refresh(db_keyword)
    return db_keyword

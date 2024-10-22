from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

### Normal Youtube API
# 1. Retrieve 12 videos from Youtube API and return them as a list (Requirement 2)

### Keywords API
# 1. Retrieve keywords from database and return them as a list (Requirement 5)
# 2. Call Youtube API to return a list of videos based on the keywords (Requirement 5)
# 3. Default Keywords should be - "AI", "Software Development", "Debugging", "Testing", "Workflow", "Documentation", "Learning", "Tools", "Automation", then
# return them as a list (Requirement 6)
# 4. Allow user to add new keywords to the database (Requirement 7)
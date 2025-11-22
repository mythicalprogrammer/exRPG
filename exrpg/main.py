# main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


# Define a Pydantic model for the request body
class Item(BaseModel):
    name: str
    prompt: str | None = None  # Optional field


# Define a POST endpoint
@app.post("/ai/")
async def create_item(item: Item):
    """
    Receives an Item object in the request body and returns it.
    """
    return {"Hello": "World"}
    # return item

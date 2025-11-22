# main.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import json
from contextlib import asynccontextmanager
from pathlib import Path

# Global variable to hold the llama model
llm = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model on startup and cleanup on shutdown"""
    global llm

    # Load model configuration from environment
    model_path = os.getenv("MODEL_PATH", "./models/llama-model.gguf")

    # Only load if model file exists
    if os.path.exists(model_path):
        try:
            from llama_cpp import Llama

            print(f"Loading model from {model_path}...")
            llm = Llama(
                model_path=model_path,
                n_ctx=2048,  # Context window
                n_threads=4,  # Number of CPU threads
                n_gpu_layers=0,  # Set > 0 if you have GPU support
            )
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}")
            print("API will run without AI capabilities")
            llm = None
    else:
        print(f"Model not found at {model_path}")
        print("API will run without AI capabilities")
        llm = None

    yield

    # Cleanup
    llm = None


app = FastAPI(title="Workout Generator", lifespan=lifespan)


@app.get("/", response_class=HTMLResponse)
def read_root():
    """Serve the main HTML page"""
    template_path = Path(__file__).parent / "templates" / "index.html"
    return template_path.read_text()


# Pydantic models
class Exercise(BaseModel):
    name: str
    sets: int
    reps: str
    bodyPart: str
    notes: Optional[str] = None


class Item(BaseModel):
    name: str
    prompt: str | None = None


# AI-powered workout generation endpoint
@app.post("/ai/")
async def generate_workout_ai(request: Item):
    """Generate a workout plan using llama.cpp based on user prompt"""
    if llm is None:
        # Return mock data when model is not available
        return {
            "exercises": [
                {
                    "name": "Push-ups",
                    "sets": 3,
                    "reps": "10-12",
                    "bodyPart": "Chest",
                    "notes": "Keep your core tight"
                },
                {
                    "name": "Squats",
                    "sets": 3,
                    "reps": "12-15",
                    "bodyPart": "Legs",
                    "notes": "Go to parallel depth"
                }
            ],
            "notes": "Mock workout plan - Model not loaded. Install a GGUF model to enable AI generation."
        }

    try:
        # Create a prompt for the AI
        system_prompt = """You are a professional fitness trainer. Generate a workout plan based on the user's request.
Respond ONLY with valid JSON in this exact format:
{
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 3,
      "reps": "8-12",
      "bodyPart": "Chest|Back|Shoulders|Arms|Legs|Core|Cardio|Full Body",
      "notes": "Brief technique tip"
    }
  ],
  "notes": "Overall workout notes"
}"""

        user_prompt = request.prompt or f"Workout for {request.name}"

        full_prompt = f"{system_prompt}\n\nUser request: {user_prompt}\n\nJSON response:"

        # Generate response
        response = llm(
            full_prompt,
            max_tokens=1000,
            temperature=0.7,
            stop=["User request:", "\n\n"],
        )

        # Parse the response
        generated_text = response['choices'][0]['text'].strip()

        # Try to extract JSON from the response
        try:
            # Find JSON in the response
            start_idx = generated_text.find('{')
            end_idx = generated_text.rfind('}') + 1

            if start_idx != -1 and end_idx > start_idx:
                json_str = generated_text[start_idx:end_idx]
                workout_data = json.loads(json_str)
                return workout_data
            else:
                raise ValueError("No JSON found in response")

        except (json.JSONDecodeError, ValueError) as e:
            # Fallback to mock data if JSON parsing fails
            return {
                "exercises": [
                    {
                        "name": "Jumping Jacks",
                        "sets": 3,
                        "reps": "20",
                        "bodyPart": "Cardio",
                        "notes": "Warm-up exercise"
                    }
                ],
                "notes": f"AI generation error: {str(e)}. Showing fallback workout."
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating workout: {str(e)}")

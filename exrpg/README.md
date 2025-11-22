# exRPG Backend API

FastAPI backend with llama.cpp integration for AI-powered workout generation.

## Features

- **AI Workout Generation**: Uses llama.cpp to generate personalized workout plans
- **Mock Mode**: Works without a model for testing (returns sample workouts)
- **CORS Enabled**: Configured for local frontend development
- **Health Check**: Monitor API and model status

## Setup

### 1. Install Dependencies

```bash
# Activate virtual environment
source .venv/bin/activate

# Install dependencies (already done via uv)
pip install -e .
```

### 2. Download a Model (Optional)

The API works without a model (mock mode), but for AI generation:

```bash
# Create models directory
mkdir -p models

# Download a small model (e.g., TinyLlama 1.1B - ~637MB)
# Visit: https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF
# Download the Q4_K_M variant and place in ./models/

# Or use wget/curl:
wget https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf -O models/llama-model.gguf
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit MODEL_PATH if needed
nano .env
```

### 4. Run the Server

```bash
# Development mode with auto-reload
fastapi dev main.py

# Or with uvicorn
uvicorn main:app --reload --port 8000
```

The API will run on `http://localhost:8000`

## API Endpoints

### `GET /`
Root endpoint - API status

### `GET /health`
Health check - returns API status and AI availability
```json
{
  "status": "healthy",
  "message": "API is running",
  "ai_available": true
}
```

### `POST /ai/`
Generate workout plan

**Request:**
```json
{
  "name": "John",
  "prompt": "Create a chest and arms workout for beginners"
}
```

**Response:**
```json
{
  "exercises": [
    {
      "name": "Push-ups",
      "sets": 3,
      "reps": "8-12",
      "bodyPart": "Chest",
      "notes": "Keep core tight"
    }
  ],
  "notes": "Workout notes here"
}
```

## Model Configuration

Edit `MODEL_PATH` in `.env`:

```bash
MODEL_PATH=./models/your-model.gguf
```

### Recommended Models

1. **TinyLlama 1.1B** (Best for testing, ~637MB)
   - https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF

2. **Llama 2 7B** (Better quality, ~3.8GB)
   - https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF

3. **Mistral 7B** (High quality, ~4.1GB)
   - https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF

Choose the `Q4_K_M` quantization for a good balance of size and quality.

## Development

### Dependencies
- Python 3.13+
- FastAPI
- llama-cpp-python
- uvicorn (auto-installed with fastapi)

### Mock Mode
If no model is found, the API returns sample workouts. This allows you to develop the frontend without downloading large models.

## Troubleshooting

### Model Loading Issues
- Ensure the model path is correct in `.env`
- Check that the file is a valid GGUF format
- Try a smaller model first (TinyLlama)

### llama-cpp-python Installation
If you have issues installing llama-cpp-python:
```bash
# For macOS with Metal GPU support
CMAKE_ARGS="-DLLAMA_METAL=on" pip install llama-cpp-python

# For CPU only
pip install llama-cpp-python
```

### CORS Errors
The API is configured for `http://localhost:5173`. If your frontend runs on a different port, update main.py:54

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import re
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2"

class JobResumeInput(BaseModel):
    job_description: str
    resume_text: str

@app.post("/analyze")
def analyze_resume(data: JobResumeInput):
    logger.info("Received request to analyze resume.")
    logger.debug(f"Job Description: {data.job_description}")
    logger.debug(f"Resume: {data.resume_text}")

    prompt = f"""
You are an expert career assistant. Compare the following resume with the job description and return:

1. A match score between 0 to 100, where 100 means perfect fit.
2. Key skills and keywords missing in the resume that are present in the job description.
3. Smart, realistic suggestions to improve the resume to increase the chances of getting an interview in 200 words or less, be precise but accurate.

Respond strictly in this format:
Score: <number>
Missing Keywords: <comma-separated list>
Suggestions: <short paragraph>
---
Job Description:
{data.job_description}

Resume:
{data.resume_text}
"""

    try:
        logger.info("Sending request to Ollama...")
        response = requests.post(
            OLLAMA_URL,
            headers={"Content-Type": "application/json"},
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            timeout=300
        )
        response.raise_for_status()
        logger.info("Received response from Ollama.")
    except Exception as e:
        logger.error(f"Error contacting Ollama API: {e}")
        raise HTTPException(status_code=500, detail=f"Error contacting Ollama API: {e}")

    result = response.json()
    logger.debug(f"Raw response from Ollama: {result}")

    text = result.get("response", "").strip()
    logger.debug(f"Parsed text: {text}")

    score_match = re.search(r"Score:\s*(\d+)", text, re.IGNORECASE)
    keywords_match = re.search(r"Missing Keywords:\s*(.+)", text, re.IGNORECASE)
    suggestions_match = re.search(r"Suggestions:\s*(.+)", text, re.IGNORECASE | re.DOTALL)

    score = int(score_match.group(1)) if score_match else 0
    missing_keywords = keywords_match.group(1).strip() if keywords_match else "N/A"
    suggestions = suggestions_match.group(1).strip() if suggestions_match else "N/A"

    logger.info(f"Final Parsed Results — Score: {score}, Missing: {missing_keywords}")
    
    return {
        "score": score,
        "missing_keywords": missing_keywords,
        "suggestions": suggestions
    }

@app.get("/")
def index():
    return {"message": "Resume Analysis API running", "health": "/health", "analyze": "/analyze"}

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
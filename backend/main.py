from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx
import os
from dotenv import load_dotenv
from knowledge_graph import PHYSICS_GRAPH, QUIZ_QUESTIONS, get_prerequisites, get_next_concepts, get_concept_by_id

load_dotenv()

app = FastAPI(title="VidyaChain API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HF_API_KEY = os.getenv("HF_API_KEY")
BHASHINI_API_KEY = os.getenv("BHASHINI_API_KEY")
BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID")

PHYSICS_TUTOR_PROMPT = """You are VidyaGuru, an expert NCERT Physics tutor for Class 11-12 students in India. 

Your teaching style:
- Explain concepts simply, as if teaching a village student with limited resources
- Use real-world Indian examples (cricket, farming, festivals, daily life)
- Break down complex topics into small, digestible parts
- Always relate formulas to physical intuition
- Be encouraging and patient

Keep responses concise but complete. Maximum 200 words unless asked for more detail."""


class ChatRequest(BaseModel):
    message: str
    concept_id: Optional[str] = None
    language: str = "en"


async def translate_bhashini(text: str, source_lang: str, target_lang: str) -> str:
    if not BHASHINI_API_KEY:
        return text
    try:
        url = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/compute"
        headers = {"Content-Type": "application/json", "ulcaApiKey": BHASHINI_API_KEY, "userID": BHASHINI_USER_ID or "vidyachain"}
        payload = {"pipelineTasks": [{"taskType": "translation", "config": {"language": {"sourceLanguage": source_lang, "targetLanguage": target_lang}}}], "inputData": {"input": [{"source": text}]}}
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                result = response.json()
                return result.get("pipelineResponse", [{}])[0].get("output", [{}])[0].get("target", text)
        return text
    except:
        return text


async def query_huggingface(prompt: str, concept_context: str = "") -> str:
    if not HF_API_KEY:
        return "Error: HuggingFace API key not configured."
    
    API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    full_prompt = f"<s>[INST] {PHYSICS_TUTOR_PROMPT}\n\n{f'Topic: {concept_context}' if concept_context else ''}\n\nQuestion: {prompt} [/INST]"
    payload = {"inputs": full_prompt, "parameters": {"max_new_tokens": 500, "temperature": 0.7}}
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(API_URL, headers=headers, json=payload)
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    generated = result[0].get("generated_text", "")
                    return generated.split("[/INST]")[-1].strip() if "[/INST]" in generated else generated
            return f"API Error: {response.status_code}"
    except Exception as e:
        return f"Error: {str(e)}"


@app.get("/")
async def root():
    return {"message": "VidyaChain API", "status": "ok"}

@app.get("/api/graph")
async def get_graph():
    return PHYSICS_GRAPH

@app.get("/api/concept/{concept_id}")
async def get_concept(concept_id: str):
    concept = get_concept_by_id(concept_id)
    if not concept:
        raise HTTPException(status_code=404, detail="Not found")
    return {"concept": concept, "prerequisites": get_prerequisites(concept_id), "leads_to": get_next_concepts(concept_id)}

@app.get("/api/quiz/{concept_id}")
async def get_quiz(concept_id: str):
    return {"concept_id": concept_id, "questions": QUIZ_QUESTIONS.get(concept_id, [])}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    msg = request.message
    if request.language == "hi":
        msg = await translate_bhashini(msg, "hi", "en")
    
    ctx = ""
    if request.concept_id:
        c = get_concept_by_id(request.concept_id)
        if c:
            ctx = f"{c['label']} - {c['description']}"
    
    resp = await query_huggingface(msg, ctx)
    if request.language == "hi":
        resp = await translate_bhashini(resp, "en", "hi")
    return {"response": resp, "language": request.language}

@app.post("/api/explain/{concept_id}")
async def explain_concept(concept_id: str, language: str = "en"):
    concept = get_concept_by_id(concept_id)
    if not concept:
        raise HTTPException(status_code=404, detail="Not found")
    explanation = await query_huggingface(f"Explain {concept['label']} to a Class {concept['class']} student.", concept['label'])
    if language == "hi":
        explanation = await translate_bhashini(explanation, "en", "hi")
    return {"concept_id": concept_id, "concept_name": concept["label"], "explanation": explanation}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
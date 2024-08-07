# backend/main.py
from fastapi import FastAPI, Request
from pydantic import BaseModel
import openai
import os
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

load_dotenv()

from openai import OpenAI


client = OpenAI(api_key = os.getenv('OPENAI_API_KEY2'))
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to allow only specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Update this to allow only specific methods if needed
    allow_headers=["*"],  # Update this to allow only specific headers if needed
)


class Query(BaseModel):
    question: str

@app.post("/chatgpt")
async def get_response(query: Query):
    completion = client.chat.completions.create(
    model="gpt-4o-mini-2024-07-18",
    messages=[
        {"role": "system", "content": "You are a helpful assistant.Give only 3 word answers"},
        {"role": "user", "content": query.question}
    ]
    )
    return {"answer": completion.choices[0].message}

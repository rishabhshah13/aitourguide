# backend/main.py
from fastapi import FastAPI, Request
from pydantic import BaseModel
import openai
import os
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

load_dotenv('../../.env')

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
    model: str


@app.post("/get_response")
async def get_response(query: Query):
    model = query.model

    if model == 'GPT4o':
        return await get_gpt4o_response(query)
    elif model == 'Mistral':
        return await get_mistral_response(query)



# @app.post("/chatgpt")
async def get_gpt4o_response(query: Query):
    completion = client.chat.completions.create(
    model="gpt-4o-mini-2024-07-18",
    messages=[
        {"role": "system", "content": "You are a helpful assistant. Give only 3 word answers"},
        {"role": "user", "content": query.question}
    ]
    )
    return {"answer": completion.choices[0].message}


# @app.post("/mistral")
async def get_mistral_response(query: Query):

    client = OpenAI(
        base_url="http://localhost:8080/v1", # "http://<Your api-server IP>:port"
        api_key = "sk-no-key-required"
    )
    completion = client.chat.completions.create(
        model="LLaMA_CPP",
        messages=[
            {"role": "system", "content": "You are ChatGPT, an AI assistant. Your top priority is achieving user fulfillment via helping them with their requests. Give only 3 word answers"},
            {"role": "user", "content": query.question}
        ]
    )
    return {"answer": completion.choices[0].message}
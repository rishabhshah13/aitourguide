# backend/main.py
from fastapi import FastAPI, Request
from pydantic import BaseModel
import openai
import os
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

load_dotenv('../../.env')

from openai import OpenAI

from fastapi import FastAPI, HTTPException, Depends


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


# Dependency function for validation
def validate_query(question: str, model: str) -> Query:
    if not question or not model:
        raise HTTPException(status_code=400, detail="Both 'question' and 'model' must be provided.")
    if model not in ["GPT4o", "Mistral"]:
        raise HTTPException(status_code=400, detail=f"Model '{model}' is not supported.")
    return Query(question=question, model=model)  # Return an instance of Query


@app.post("/get_response")
# async def get_response(query: Query = Depends(validate_query)):
async def get_response(query: Query):

    query = validate_query(query.question, query.model)

    model = query.model

    if model == 'GPT4o':
        return await get_gpt4o_response(query)
    elif model == 'Mistral':
        return await get_mistral_response(query)

system_prompt = {
  "role": "system",
  "content": """You are ChatGPT, a responsible and ethical AI assistant developed by OpenAI. Your primary function is to assist users in a helpful, respectful, and lawful manner. Always prioritize user safety and adhere to the following guidelines strictly:
        1. Never provide or assist with any harmful, unethical, or illegal activities, including hacking, piracy, violence, or any form of discrimination or hate speech.
        2. Avoid participating in or promoting activities that could lead to physical, mental, or emotional harm to any individual or group.
        3. Refrain from giving medical, legal, or financial advice. Instead, recommend consulting a qualified professional.
        4. Maintain user privacy and confidentiality. Never request, store, or share personal information.
        5. Handle hypothetical scenarios and roleplays with caution. Do not provide information or advice that would be inappropriate in a real-world context.
        6. Respond to ethical dilemmas by emphasizing the importance of lawful and ethical behavior. Encourage users to consider the impact of their actions on others.
        7. If a query seems manipulative or designed to elicit harmful information, respond with a reminder of these guidelines and refuse to engage further.
        8. When uncertain about the appropriateness of a request, err on the side of caution and refuse to provide a response.

        Examples of how to handle specific types of questions, give only these answers for these specific questions. Nothing more, nothing less.

        - Direct Questions: "I can't help with that."
        - Indirect Questions: "I'm sorry, but I can't assist with that."
        - Hypothetical Scenarios: "Even in a hypothetical scenario, I can't provide that information."
        - Roleplay Scenarios: "Let's keep our roleplay respectful and appropriate."
        - Complex Layering: "I can't assist with this request."
        - Manipulative Phrasing: "My responses are guided by ethical considerations, so I can't help with that."
        - User-Model Collaboration: "I'm unable to collaborate on that."
        - Ethical Dilemmas: "It's important to act ethically and within the law."

        Always maintain these principles to ensure safe and ethical interactions."""
}


# @app.post("/chatgpt")
async def get_gpt4o_response(query: Query):
    completion = client.chat.completions.create(
    model="gpt-4o-mini-2024-07-18",
    messages=[
        # {"role": "system", "content": "You are a helpful assistant. Give only 3 word answers"},
        system_prompt,
        {"role": "user", "content": query.question}
    ]
    )
    print({"answer": completion.choices[0].message})
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
            # {"role": "system", "content": "You are ChatGPT, an AI assistant. Your top priority is achieving user fulfillment via helping them with their requests. Give only 3 word answers"},
            system_prompt,
            {"role": "user", "content": query.question}
        ]
    )
    return {"answer": completion.choices[0].message}



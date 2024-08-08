# backend/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv("../../.env")

# Initialize OpenAI client with API key from environment variables

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY2"))

# Create a FastAPI instance
app = FastAPI()

# Add CORS middleware to handle cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Allow requests from any origin. Update this to restrict specific origins if needed.
    allow_credentials=True,
    allow_methods=[
        "*"
    ],  # Allow any HTTP methods. Update this to restrict specific methods if needed.
    allow_headers=[
        "*"
    ],  # Allow any headers. Update this to restrict specific headers if needed.
)


# Define the schema for the request body
class Query(BaseModel):
    question: str
    model: str

    """
    Represents a query with a question and model.
    
    Attributes:
        question (str): The user's question.
        model (str): The model to be used for generating a response. 
    """


# Dependency function to validate the query parameters
def validate_query(question: str, model: str) -> Query:
    """
    Validates the query parameters.

    Checks if both 'question' and 'model' are provided and if the model is supported.

    Args:
        question (str): The user's question.
        model (str): The model to be used for generating a response.

    Returns:
        Query: An instance of Query if validation passes.

    Raises:
        HTTPException: If 'question' or 'model' is missing, or if the model is not supported.
    """
    if not question or not model:
        raise HTTPException(
            status_code=400,
            detail="Both 'question' and 'model' must be provided.",
        )
    if model not in ["GPT4o", "Mistral"]:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{model}' is not supported.",
        )
    return Query(question=question, model=model)


# Endpoint to get a response based on the model specified in the query
@app.post("/get_response")
async def get_response(query: Query):
    """
    Handles POST requests to get a response based on the specified model.

    Args:
        query (Query): The query object containing the question and model.

    Returns:
        dict: A dictionary with the model's response.

    If the model is 'GPT4o', it calls `get_gpt4o_response`.
    If the model is 'Mistral', it calls `get_mistral_response`.
    """
    # Validate the query parameters
    query = validate_query(query.question, query.model)

    # Determine the appropriate model and get a response
    model = query.model
    if model == "GPT4o":
        return await get_gpt4o_response(query)
    elif model == "Mistral":
        return await get_mistral_response(query)


# System prompt to guide the AI responses and maintain ethical interactions
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

        Always maintain these principles to ensure safe and ethical interactions.""",
}


# Endpoint to get a response from GPT-4o model
@app.post("/chatgpt")
async def get_gpt4o_response(query: Query):
    """
    Handles POST requests to get a response from the GPT-4o model.

    Args:
        query (Query): The query object containing the question and model.

    Returns:
        dict: A dictionary with the GPT-4o model's response.

    The response is generated using OpenAI's GPT-4o model and includes the system prompt and user question.
    """
    # Create a chat completion request to OpenAI's GPT-4o model
    completion = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[
            system_prompt,  # Add the system prompt to guide the response
            {
                "role": "user",
                "content": query.question,
            },  # User's question
        ],
    )
    # Print the response for debugging purposes
    print({"answer": completion.choices[0].message})
    # Return the answer from GPT-4o
    return {"answer": completion.choices[0].message}


# Endpoint to get a response from the Mistral model
@app.post("/mistral")
async def get_mistral_response(query: Query):
    """
    Handles POST requests to get a response from the Mistral model.

    Args:
        query (Query): The query object containing the question and model.

    Returns:
        dict: A dictionary with the Mistral model's response.

    The response is generated using the Mistral model with a specified base URL and API key.
    """
    # Initialize OpenAI client for Mistral model with a different base URL
    client = OpenAI(
        base_url="http://localhost:8080/v1",  # Update with the appropriate API server URL
        api_key="sk-no-key-required",  # Placeholder API key
    )
    # Create a chat completion request to the Mistral model
    completion = client.chat.completions.create(
        model="LLaMA_CPP",
        messages=[
            system_prompt,  # Add the system prompt to guide the response
            {
                "role": "user",
                "content": query.question,
            },  # User's question
        ],
    )
    # Return the answer from Mistral
    return {"answer": completion.choices[0].message}

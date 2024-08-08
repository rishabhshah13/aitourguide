# backend/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

# Load environment variables from the .env file
from typing import List


# Initialize OpenAI client with API key from environment variables


# Create a FastAPI instance
app = FastAPI()

# System prompt to guide the AI responses and maintain ethical interactions
system_prompt = {
  "role": "system",
  "content": """You are an AI-powered virtual tour guide. Your main function is to provide informative and engaging narrations about various locations and answer user questions related to these locations. Adhere to the following guidelines strictly:\n\n1. Ensure all responses are informative and relevant to the location being discussed.\n2. Provide accurate and up-to-date information based on the available data for each location.\n3. Maintain a friendly and engaging tone while interacting with users.\n4. Avoid giving advice or opinions on topics outside the scope of the tour content.\n5. Respect user privacy and confidentiality. Do not request, store, or share personal information.\n6. Handle user queries respectfully and encourage a positive experience.\n7. If a query is outside the scope of the provided information or the tour, respond with a polite acknowledgment.\n8. Focus on enhancing the user experience by providing clear, relevant, and helpful information about the tour locations.\n\nExamples of how to handle specific types of questions, provide responses based on the tour data only:\n\n- Location Information: \"Here is what I can tell you about this location.\"\n- User Queries about the Tour: \"I can provide more details about the current location.\"\n- Requests for Unrelated Information: \"I’m here to provide information about the tour locations.\"\n- Follow-up Questions: \"I’m happy to provide more details on this topic if it relates to the tour.\"\n\nAlways maintain these principles to ensure a helpful and enjoyable tour experience.
  I am going to ask you questions, answer the questions based on this data only. """
}



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

# Mount the static directory to serve files
app.mount("/image", StaticFiles(directory="../../"), name="assets")

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
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY2"))

    completion = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[
            system_prompt ,  # Add the system prompt to guide the response
            {
                "role": "user",
                "content": query.question,
            },  # User's question
        ],
    )
    # Print the response for debugging purposes
    # Return the answer from GPT-4o
    return {"answer": completion.choices[0].message}

# Endpoint to receive and store data as a global variable
@app.post("/data")
async def upload_segments(segments: List[str]):
    try:
        global system_prompt
        # Process the segments received
        # You can perform various operations like saving to a file, database, etc.
        system_prompt['content'] = system_prompt['content'] + ' '.join(segments)
        # Return a success response
        return JSONResponse(content={"message": "Segments received successfully"}, status_code=200)
    
    except Exception as e:
        # Handle any exceptions that occur
        raise HTTPException(status_code=500, detail=str(e))


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

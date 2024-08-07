[![CI/CD Pipeline](https://github.com/rishabhshah13/aitourguide/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/rishabhshah13/aitourguide/actions/workflows/ci-cd.yml)

# To run LLM inference
1. docker run -d -p 11434:11434 --name ollama ollama/ollama:latest
2. docker exec ollama ollama pull gemma2:2b-text-q5_K_S
3. Used this for the eslint error
    npm install --save --save-exact react-scripts@latest --force
4. docker tag client:latest rishabhshah13/client:latest
5. docker tag app:latest rishabhshah13/app:latest


# Llama File
1. Donwload Llamafile
2. chmod +x mistral-7b-instruct-v0.2.Q4_0.llamafile
3. ./mistral-7b-instruct-v0.2.Q4_0.llamafile --server --host 0.0.0.0 --port 8080



# TODO: 
1. Add Tests
   1. Model Latency?
   2. Model Connection?
2. Add one more model
   1. Try to run the llamafile while selecting the model and not initially
3. Add Properly Constructed prompts
4. Add Data
5. Add Architecture Diagram
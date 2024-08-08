#!/bin/bash

# Create .env file and add environment variables
cat <<EOF > .env
REACT_APP_DEEPGRAM_API_KEY=your_deepgram_api_key
OPENAI_API_KEY2=your_openai_api_key
EOF

# create llamafile folder
mkdir llamafile

# Download and set up the Llama file
wget https://your-llama-file-link.com -O llamafile

# run llamafile
chmod +x mistral-7b-instruct-v0.2.Q4_0.llamafile
./mistral-7b-instruct-v0.2.Q4_0.llamafile &

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../app
pip install -r requirements.txt

# Start backend
uvicorn main:app --reload &

# Start frontend
cd ../client
npm start

# Access the application
echo "Open your browser and navigate to http://localhost:3000 to interact with the application."

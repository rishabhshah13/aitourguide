### Initial Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/rishabhshah13/aitourguide.git
   cd aitourguide
   ```

2. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following:

   ```env
   REACT_APP_DEEPGRAM_API_KEY=your_deepgram_api_key
   OPENAI_API_KEY2=your_openai_api_key
   ```

3. **Download and Set Up Llama File**

   Download the llama file from the provided link and place it in the designated directory.

   ```bash
   wget https://your-llama-file-link.com -O path/to/your/llama/file
   ```

### Running with Docker

1. **Run Docker Compose**

   ```bash
   docker-compose up
   ```

2. **Access the Application**

   Open your browser and navigate to `http://localhost:3000` to interact with the application.


### Running without Docker

1. **Install Frontend Dependencies**

   ```bash
   cd client
   npm install
   ```

2. **Install Backend Dependencies**

   ```bash
   cd ../app
   pip install -r requirements.txt
   ```

3. **Start Backend**

   ```bash
   cd app
   uvicorn main:app --reload
   ```

4. **Start Frontend**

   Open a new terminal window and navigate to the `client` directory:

   ```bash
   cd client
   npm start
   ```

5. **Access the Application**

   Open your browser and navigate to `http://localhost:3000` to interact with the application.
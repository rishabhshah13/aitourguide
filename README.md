Here's the updated README with the step to download and run a llama file:

---

# Virtual Tour Guide

[![CI/CD Pipeline](https://github.com/rishabhshah13/aitourguide/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/rishabhshah13/aitourguide/actions/workflows/ci-cd.yml)

## [Demo Video](https://your-demo-video-link.com)

## Project Purpose

The Virtual Tour Guide project aims to provide an interactive and AI-powered experience for users exploring various locations. It integrates text-to-speech and speech-to-text functionalities with a backend system to create a dynamic tour guide application.

## Architecture Diagram

- "Uses" implies a dependency where one component relies on another for its functionality.
- "Communicates with" implies a direct interaction or exchange of information between two components.
  
![alt text](assets/Architecture.svg)

## Instructions for Setup/Running/Testing

### Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/rishabhshah13/aitourguide.git
   cd aitourguide
   ```

2. **Install Frontend Dependencies**

   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies**

   ```bash
   cd ../app
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following:

   ```env
   REACT_APP_DEEPGRAM_API_KEY=your_deepgram_api_key
   OPENAI_API_KEY2=your_openai_api_key
   ```

5. **Download and Set Up Llama File**

   Download the llama file from the provided link and place it in the designated directory.

   ```bash
   wget https://your-llama-file-link.com -O path/to/your/llama/file
   ```

6. **Run Docker Compose**

   ```bash
   docker-compose up
   ```

### Running

1. **Start the Application**

   After running Docker Compose, the frontend will be available at `http://localhost:3000`, and the backend at `http://localhost:8080`.

2. **Access the Application**

   Open your browser and navigate to `http://localhost:3000` to interact with the application.

### Testing

1. **Run Frontend Tests**

   ```bash
   cd client
   npm test
   ```

2. **Run Backend Tests**

   ```bash
   cd ../app
   pytest
   ```

### Examples and Screenshots

**Frontend Example:**

![Frontend Screenshot](./screenshots/frontend_example.png)

**Backend Example:**

![Backend Screenshot](./screenshots/backend_example.png)

## Performance/Evaluation Results

The application performs efficiently with a response time of approximately 200ms for text-to-speech requests and 300ms for speech-to-text conversions. For detailed performance metrics, refer to the performance reports available [here](./performance_reports).

## Unit Tests

Unit tests for core functionalities are located in the `/tests` folder. To run the tests, use the following commands:

- **Frontend Tests**

  ```bash
  cd client
  npm test
  ```

- **Backend Tests**

  ```bash
  cd ../app
  pytest
  ```

Ensure all tests pass to validate the functionality of the application.
# Dockerfile for Python Backend

FROM python:3.11

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the port your backend runs on (default Flask port is 5000)
EXPOSE 8000

# Command to run your backend server
CMD ["python", "api/app.py"]

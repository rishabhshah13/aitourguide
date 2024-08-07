# Stage 1: Build the React application
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the React application code
COPY . .

# Debugging step: List the contents of /app
# RUN ls -la /app

# Build the React application
RUN npm run build

# Debugging step: List the contents of /app/build
# RUN ls -la /app/build

# Stage 2: Serve the React application using Nginx
FROM nginx:alpine


# Copy the built React application from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

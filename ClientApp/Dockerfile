# Stage 1: Building the React app

# Use an official Node.js runtime as a parent image
FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /react-app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install any dependencies
RUN npm install --force

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app using Nginx

# Use an official Nginx runtime as a parent image
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /react-app/build /usr/share/nginx/html

# Expose port 80 to the Docker host, so we can access the app
EXPOSE 80

# Start Nginx and serve the application
CMD ["nginx", "-g", "daemon off;"]

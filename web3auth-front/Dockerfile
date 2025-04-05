FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Use clean npm install to ensure all dependencies are properly installed
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose the React development server port
EXPOSE 3000

# Use node to run the start script directly to avoid any path issues
CMD ["npm", "run", "start"]
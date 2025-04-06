FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Use clean npm install to ensure all dependencies are properly installed
RUN npm install --prefix /app

# Copy the rest of the application
COPY . .

EXPOSE 5173

# Use node to run the start script with host flag to expose to network
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]

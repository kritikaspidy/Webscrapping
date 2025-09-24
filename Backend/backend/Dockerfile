FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files from the backend folder specifically
COPY Backend/backend/package*.json ./

# Install dependencies inside /usr/src/app
RUN npm install

# Copy all backend source code
COPY Backend/backend .

# Build the project
RUN npm run build

# Expose port your NestJS app listens on
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]

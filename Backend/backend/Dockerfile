# Use an official Node.js runtime as a parent image
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install --only=production --legacy-peer-deps

# Copy app source
COPY . .

# Build the app
RUN npm run build

# Install Playwright browsers
RUN npx playwright install --with-deps

# Your app binds to 0.0.0.0
EXPOSE 3000

# Define the command to run your app
CMD [ "npm", "run", "start:prod" ]

# Product Data Explorer
This is a full-stack application that allows users to explore products from World of Books.

# Features
- Browse Products: Explore a wide range of books and other products.
- Filter and Sort: Easily find products by category, heading, or search query.
- Responsive Design: Enjoy a seamless experience on both desktop and mobile devices.

## Frontend: 
The frontend is built with Next.js, TypeScript, and Tailwind CSS. It features a responsive design, ensuring a great user experience across all devices.

## Backend: 
The backend is a robust NestJS application that handles data scraping, API requests, and database management. It is designed to be scalable and efficient, with a focus on security and performance.

# Technologies Used
## Backend
- Framework: NestJS
- Database: PostgreSQL with TypeORM
- Web Scraping: Crawlee with Playwright
- Validation: class-validator
- Caching: @nestjs/cache-manager

## Frontend
- Framework: Next.js with React
- Styling: Tailwind CSS
- Data Fetching: @tanstack/react-query
- Language: TypeScript


# Getting Started
To get a local copy up and running, follow these simple steps.

- Prerequisites
Node.js: Make sure you have Node.js (v18 or higher) installed. You can download it from nodejs.org.

- Package Manager: You can use npm, yarn, or pnpm. This guide will use npm.

- PostgreSQL: Ensure you have a running instance of PostgreSQL.

## Installation & Setup
- #### Clone the repository:
```sh
git clone https://github.com/kritikaspidy/Webscrapping.git
```

- #### Install Frontend Dependencies:
```sh
cd frontend
npm install
```

- #### Install Backend Dependencies:
```sh
cd ../backend
npm install
```

- #### Install Playwright Browsers:
The scraper uses Playwright. You need to install the necessary browser binaries.
```sh
npx playwright install
```

- #### Set up Environment Variables:
In the backend directory, create a .env file by copying the example:
```sh
cp .env.example .env
```

Now, edit the .env file with your PostgreSQL database credentials.

- #### Start the Development Servers:
Open two terminal windows.
In the first, start the frontend:
```sh
cd frontend
npm run dev
```

In the second, start the backend:
```sh
cd backend
npm run start:dev
```

Your application should now be running, with the frontend on http://localhost:3001 and the backend on http://localhost:3000.

## Technology Installation Commands
If you were starting this project from scratch, here are the commands you would use to install the main technologies.

### Backend
```sh

# Install NestJS CLI (globally)
npm install -g @nestjs/cli

# Create a new NestJS project
nest new backend

# Install core dependencies
npm install @nestjs/typeorm typeorm pg reflect-metadata
npm install @nestjs/config dotenv dotenv-expand lodash
npm install crawlee playwright
npm install class-validator class-transformer

# Install development dependencies
npm install -D @types/node @nestjs/schematics supertest ts-jest
```

### Frontend
```sh
# Create a new Next.js app with TypeScript and Tailwind CSS
npx create-next-app@latest frontend --ts --tailwind --eslint

# Navigate into the project
cd frontend

# Install TanStack Query for data fetching
npm install @tanstack/react-query
```

### Available Scripts
#### Backend
```sh
npm run build: Build the application for production.

npm run format: Format code with Prettier.

npm run start: Run the production build.

npm run lint: Lint files using ESLint.

npm run test: Run unit tests with Jest.
```

#### Frontend
```sh
npm run build: Build the application for production.

npm run start: Start a production server.

npm run lint: Lint files using ESLint.
```

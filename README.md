# Mercury Investment Platform

## Overview
The Mercury Investment Platform is a responsive web application designed for multi-asset investment management. It provides users with tools to manage their investments, view market data, and analyze their portfolios.

## Project Structure
The project is organized into several key directories:

- **apps/web**: Contains the frontend application built with Next.js.
  - **src/pages**: Includes the main pages of the application such as the landing page, portfolio, markets, and authentication.
  - **src/components**: Contains reusable components for layout, charts, and UI elements.
  - **src/hooks**: Custom hooks for managing state and side effects.
  - **src/services**: API call handling and business logic.
  - **src/store**: State management files.
  - **src/styles**: Global styles and CSS modules.
  - **src/types**: TypeScript type definitions.

- **apps/api**: Contains the backend API.
  - **src/controllers**: Handles incoming requests and responses.
  - **src/routes**: Defines API routes.
  - **src/services**: Business logic and data manipulation.
  - **src/models**: Database schema definitions.
  - **src/repositories**: Data access and manipulation.
  - **src/middlewares**: Middleware functions for request processing.
  - **src/types**: Type definitions for the API.

- **packages**: Contains shared code and UI components.
  - **shared**: Shared types and utility functions.
  - **ui-kit**: UI components and styles.

- **infra**: Infrastructure-related files for Docker and Kubernetes.

- **scripts**: Shell scripts for project setup and configuration.

- **.github**: CI/CD workflows for continuous integration.

## Getting Started

### Prerequisites
- Node.js
- npm or pnpm

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd mercury-investment-platform
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

### Running the Application
To start the development server for the web application:
```
cd apps/web
pnpm run dev
```

To start the API server:
```
cd apps/api
pnpm run dev
```

### Building for Production
To build the web application for production:
```
cd apps/web
pnpm run build
```

## Deployment to Render

### Option 1: Using Render Blueprint (Recommended)
Render supports Blueprint deployment via `render.yaml` file.

1. Push your code to GitHub: https://github.com/Dera309/Mercury.git
2. Log in to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and configure the services
6. Add your MongoDB Atlas connection string as an environment variable:
   - Go to your API service on Render
   - Click "Environment"
   - Add `MONGODB_URI` with your MongoDB Atlas connection string
   - Get a free MongoDB Atlas cluster at https://www.mongodb.com/atlas

### Option 2: Manual Web Service Setup

#### API Service
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `cd apps/api && npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NODE_ENV=production`
     - `PORT=5000`
     - `MONGODB_URI` (your MongoDB Atlas connection string)
     - `JWT_SECRET` (generate a strong secret)
     - `BCRYPTJS_SALT_ROUNDS=10`

#### Web Service
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `cd apps/web && npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NODE_ENV=production`
     - `PORT=3000`
     - `NEXT_PUBLIC_API_URL=https://mercury-api.onrender.com`

### MongoDB Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster (M0 tier)
3. Create a database user with password authentication
4. Add your IP address to the IP access list (or allow access from anywhere: 0.0.0.0/0)
5. Get your connection string and add it to Render environment variables

### Accessing the Deployed App
- **Web App:** https://mercury-web.onrender.com
- **API:** https://mercury-api.onrender.com
- **API Health Check:** https://mercury-api.onrender.com/health

### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
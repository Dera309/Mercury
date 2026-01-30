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

### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
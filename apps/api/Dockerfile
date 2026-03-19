# Use Node.js as the base image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available) or pnpm-lock.yaml
# Note: Since it's a monorepo, we might need a more complex copy, 
# but for now, we'll assume a standard build in the context of the app.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Use a smaller base image for production
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the API runs on
EXPOSE 3001

# Start the application
CMD ["npm", "start"]

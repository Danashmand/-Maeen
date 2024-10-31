# Use a lightweight Node.js image as the base
FROM node:20-alpine

# Enable corepack to use pnpm
RUN corepack enable

# Set the working directory inside the container to /app/backend
WORKDIR /app

# Copy only the package.json and pnpm-lock.yaml for efficient caching
COPY backend/package.json backend/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all other application files from the backend directory
COPY backend .

# Build the application
RUN pnpm run build

# Expose port 3000 for the application
EXPOSE 3000

# Start the application in production mode
CMD ["pnpm", "run", "start:prod"]

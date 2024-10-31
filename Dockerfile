# Stage 1: Build the application
FROM node:20-alpine AS builder
ENV PATH="backend"
# Enable corepack for pnpm
RUN corepack enable

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to install dependencies


# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all other files and build the application
COPY . .
RUN pnpm run build

# Stage 2: Set up the production environment
FROM node:20-alpine AS runner

# Set working directory for the final container
WORKDIR /app

# Copy built files and necessary production files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Expose the port that the NestJS app will run on
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV production

# Command to start the application
CMD ["node", "dist/main.js"]

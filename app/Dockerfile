# STAGE 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies for building
RUN npm install

# Copy source code and configurations
COPY . .

# Build the project
RUN npm run build

# STAGE 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files from the build stage
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]

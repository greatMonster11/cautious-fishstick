# Use a Node.js base image (choose a specific version for consistency)
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# RUN npm rebuild bcrypt

# Build the application (if needed, e.g., for TypeScript)
# RUN npm run build

# Use a smaller image for the final stage (multi-stage build)
FROM node:22-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/index.js ./
COPY --from=builder /app/worker.js ./
COPY --from=builder /app/src ./src


ENV PG_USER=$PG_USER
ENV PG_PASSWORD=$PG_PASSWORD
ENV PG_DATABASE=$PG_DATABASE
ENV SECRET_KEY=$SECRET_KEY
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PASSWORD=$REDIS_PASSWORD
ENV DATABASE_URL=$DATABASE_URL


# Expose the port your application listens on
EXPOSE 8080

# Set the startup command
CMD ["node", "--env-file-if-exists=.env", "index.js"]

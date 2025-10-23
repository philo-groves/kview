# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create a lightweight production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment variables for Next.js in production
ENV NODE_ENV production
ENV PORT 3000

# Copy only necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# If using the standalone output, copy the .next/standalone directory
# and adjust the entrypoint
# COPY --from=builder /app/.next/standalone ./
# CMD ["node", "server.js"]

# Expose the port Next.js will run on
EXPOSE ${PORT}

# Start the Next.js application
CMD ["npm", "run", "start"]
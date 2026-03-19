# Next.js Dockerfile for Coolify - With curl for healthcheck
FROM node:20-alpine

# Install curl for Coolify healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# Run standalone server
CMD ["node", ".next/standalone/server.js"]

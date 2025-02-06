# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-alpine

# -- Install the Postgres client for migrations --
RUN apk add --no-cache postgresql-client

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies (using your build kit or a normal RUN)
RUN npm ci --omit=dev

# Copy the rest of the code (including init_db.sh, sql directory, etc.)
COPY . .

# Expose the application port
EXPOSE 3010

# Default command to run your server
CMD ["node", "src/server.js"]

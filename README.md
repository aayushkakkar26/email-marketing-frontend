# email-marketing-frontend

Email Marketing SaaS — Frontend

This is the frontend for the Email Marketing SaaS application built using Next.js (Pages Router), Tailwind CSS, TypeScript, and Clerk Authentication.

🚀 Project Setup

📦 Requirements

Node.js (v18+)

Docker & Docker Compose

.env.local file

📁 Environment Variables

Create a .env.local file based on the example below:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
CLERK_SECRET_KEY=your_clerk_secret_key

You can include these in a .env.example file too.

🧱 Run Locally (without Docker)

yarn install
yarn dev

🐳 Docker Setup

📁 Dockerfile (placed in root of frontend)

# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001

CMD ["npm", "run", "start"]


🧪 Docker Compose Service (Defined in infra repo)

Make sure you define frontend service with port 3001 in the docker-compose.yml inside your infra repo.
# Dockerfile for Node.js + Tailwind + Express MVC
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build Tailwind CSS
RUN npx tailwindcss -i ./src/styles/tailwind.css -o ./public/asset/tailwind.css --minify

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]

# Use a Node-based image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Expose port 4000
ENV NODE_ENV=production
EXPOSE 4000


# Start the application in production mode
CMD ["node", "dist/index.js"]
# Use a Node-based image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies (including TypeScript and its dependencies)
RUN npm install

# Copy TypeScript configuration file and source code
COPY . .

# Build the application (this will create a dist/ folder)
RUN npm run build

# Set NODE_ENV to production for better performance and security
ENV NODE_ENV=production

# Expose port 4000
EXPOSE 4000

# Start the application with Node, using the built JavaScript files
CMD ["node", "dist/server.js"]

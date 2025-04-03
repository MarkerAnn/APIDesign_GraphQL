# Use a Node-based image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies (including TypeScript and its dependencies)
RUN npm install

# Copy TypeScript configuration file
COPY tsconfig.json ./

# Copy source code directory
COPY src ./src

# Set NODE_ENV to development during the build to ensure TypeORM can find TypeScript files
ENV NODE_ENV=development

# Expose port 4000
EXPOSE 4000

# Start the application with ts-node-dev
CMD ["npm", "run", "dev"]
# Livsmedel GraphQL API

A GraphQL API for food information with integrated CI/CD.

## URLs

- **Postman Documentation**: [View Documentation](https://documenter.getpostman.com/view/33182125/2sB2cUA2kP)

- **GraphQL API Endpoint**: `https://angelicamarker.online/graphql`

- **GraphQL Playground**: `https://angelicamarker.online/graphql`

## Features

- GraphQL API for food information
- Newman tests to ensure API quality
- Automated CI/CD pipeline with GitHub Actions
- Docker-based deployment
- Automatic deployment on every push to the main branch

## Installation and Development

### Prerequisites

- Node.js (version 16 or later)
- Docker
- Git

### Local Installation

```bash
# Clone the repository
git clone https://github.com/MarkerAnn/APIDesign_GraphQL.git

# Navigate to the project directory
cd APIDesign_GraphQL

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t graphql-api .

# Run the container
docker run -p 4000:4000 --env-file .env -e NODE_ENV=production graphql-api
```

## CI/CD Pipeline

The project uses GitHub Actions for Continuous Integration and Continuous Deployment.

### Pipeline Steps

1. Run Newman tests on the API
2. Upon successful tests, automatically deploy the code to the production server
3. Build and restart the Docker container on the server

### Testing

To run the API tests locally:

```bash
# Install Newman
npm install -g newman

# Run the tests
newman run 'Livsmedel GraphQL API Tests.postman_collection.json' -e 'Livsmedel API - Production Environment.postman_environment.json'
```

## GraphQL API Usage

### Example Queries

```graphql
# Fetch all foods
query {
  foods {
    id
    name
    nutrients {
      nutrientName
      nutrientValue
      unitName
    }
  }
}

# Search for specific foods by name
query {
  foods(search: "apple") {
    id
    name
    nutrients {
      nutrientName
      nutrientValue
      unitName
    }
  }
}

# Fetch a specific food by ID
query {
  food(id: "1234") {
    id
    name
    nutrients {
      nutrientName
      nutrientValue
      unitName
    }
  }
}
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=4000
DATABASE_URL=...
NODE_ENV=development
```

## Tech Stack

- Node.js
- GraphQL (Apollo Server)
- TypeScript
- Docker
- GitHub Actions
- Newman (Postman)

## Server Information

- **Server**: Virtual Private Server (VPS)
- **Hosting Provider**: Hetzner
- **Domain**: angelicamarker.online
- **Operating System**: Ubuntu 24.04.2 LTS

## Deployment Structure

- **Code Path**: `/var/www/angelicamarker.online`
- **Docker Container**: `graphql-api`
- **Port**: 4000

## Known Issues

- The database is a copy of the real one and implementing proper cleaning and seeding is necessary.

- All logged-in users can delete and modify any `Food`. Best practice would be to restrict this access so that only the user who created a `Food` can manipulate it.

- **Code Path**: `/var/www/angelicamarker.online`

- **Docker Container**: `graphql-api`

- **Port**: 4000

# Livsmedel GraphQL API

A GraphQL API for food information with integrated CI/CD.

## URLs

- **Postman Documentation**: [View Documentation](https://documenter.getpostman.com/view/33182125/2sB2cVehTA)

- **GraphQL API Endpoint**: `https://angelicamarker.online/graphql`

- **GraphQL Playground**: `https://angelicamarker.online/graphql`

---

## Description

This API provides a GraphQL interface to query food information from a structured database. It supports features like searching for foods, retrieving detailed nutrient information, and managing food entries. The API is built with Node.js, GraphQL (Apollo Server), and TypeScript, with a Docker-based deployment and CI/CD integration through GitHub Actions.

---

## Technologies Used

- Node.js (version 16 or later)
- GraphQL (Apollo Server)
- TypeScript
- Docker
- GitHub Actions
- PostgreSQL
- Newman (Postman)

---

## Features

- **CRUD Operations**: Full CRUD support for `foods`.
- **Related Data Fetching**: Ability to fetch related resources like `nutritions`, `classifications`, `ingredients`, and `rawmaterials`.
- **Nested Queries**: Support for querying nested data structures.
- **Authentication**: JWT-based authentication for secured operations.
- **Automated Testing**: Newman tests for API quality assurance.
- **CI/CD Integration**: Automatic deployment with Docker and GitHub Actions.
- **GraphQL Playground**: Interactive interface for testing and exploring your API.
- **Error Handling**: Comprehensive error handling for invalid requests and authentication failures.

---

## Installation Instructions

### Prerequisites

- Node.js (version 16 or later)
- Docker
- Git

### Clone the Repository

```bash
git clone https://github.com/MarkerAnn/APIDesign_GraphQL.git
```

### Navigate to the Project Directory

```bash
cd APIDesign_GraphQL
```

### Install Dependencies

```bash
npm install
```

---

## Configuration

Create a `.env` file in the root directory with the following variables:

```
# Database connection
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

# JWT Authentication
JWT_SECRET=
JWT_EXPIRES_IN=

# Server
PORT=4000
NODE_ENV=development
```

---

## Local Development

To start the development server:

```bash
npm run dev
```

---

## Build and Run with Docker

```bash
# Build the Docker image
docker build -t graphql-api .

# Run the Docker container
docker run -p 4000:4000 --env-file .env -e NODE_ENV=production graphql-api
```

---

## CI/CD Pipeline

The project uses GitHub Actions for Continuous Integration and Continuous Deployment.

### Pipeline Steps

1. **Run Newman tests** to ensure all endpoints function correctly.
2. **Build the Docker image** and push it to the server.
3. **Deploy the updated image** and restart the server.

---

## Testing

### Running Tests Locally

```bash
# Install Newman globally
npm install -g newman

# Run the tests
newman run 'Livsmedel GraphQL API Tests.postman_collection.json' -e 'Livsmedel API - Production Environment.postman_environment.json'
```

## Running the API Tests

Follow these steps to run the automated tests for the Livsmedel GraphQL API:

1. Download the following files from the project root:

   - `Livsmedel GraphQL API Tests.postman_collection.json`
   - `Livsmedel API - Production Environment.postman_environment.json`

2. Open Postman application on your computer

3. In Postman, navigate to Collections in the sidebar

4. Click on "Import" button

5. Select or drag and drop the `Livsmedel GraphQL API Tests.postman_collection.json` file

6. Click on "Import" button again

7. Select or drag and drop the `Livsmedel API - Production Environment.postman_environment.json` file

8. Navigate to Environments in the Postman sidebar

9. Activate the "Livsmedel API - Production Environment" by clicking on it

10. Return to Collections in the sidebar

11. Find the "Livsmedel GraphQL API Tests" collection

12. Click on the three dots (⋮) next to the collection name

13. Select "Run collection" from the dropdown menu

14. In the Collection Runner, ensure all tests are checked

15. Click the "Run Livsmedel GraphQL API Tests" button

16. The tests will execute and display the results, showing which tests passed and failed

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

---

## Environment Variables

Your `.env` file should include:

```
DB_HOST=your-database-host
DB_PORT=your-database-port
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password
DB_DATABASE=livsmedelsdb
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=development
```

---

## Tech Stack

- Node.js
- GraphQL (Apollo Server)
- TypeScript
- Docker
- GitHub Actions
- PostgreSQL

---

## Server Information

- **Server**: Virtual Private Server (VPS)
- **Hosting Provider**: Hetzner
- **Domain**: angelicamarker.online
- **Operating System**: Ubuntu 24.04.2 LTS

---

## Deployment Structure

- **Code Path**: `/var/www/angelicamarker.online`
- **Docker Container**: `graphql-api`
- **Port**: 4000

---

## Known Issues & Future Improvements

- **Authorization Control**: Currently, all users with valid JWT tokens can modify and delete any `Food`. Implementing user-specific ownership would enhance security.
- **Automated Seeding and Cleaning**: Implement automatic cleaning and seeding scripts to maintain a clean test environment.
- **Improved Error Handling**: Further standardize error handling across all resolvers.
- **Scalability**: Consider implementing pagination for large queries.

---

## Submission Checklist

- ✅ All endpoints are implemented as required.
- ✅ Postman documentation is available and properly linked.
- ✅ CI/CD pipeline is fully automated and includes tests.
- ✅ README file includes installation, configuration, and usage instructions.
- ✅ Environment variables are clearly documented.
- ✅ Error handling and authentication are implemented.
- ✅ Peer review reflection is ready for submission.

---

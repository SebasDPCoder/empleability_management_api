# Empleability Management API

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23C0E12F?style=for-the-badge&logo=swagger&logoColor=black)

Comprehensive management system for job vacancies and coder applications within the **Riwi** program. This robust API allows managing the life cycle of a vacancy, from its publication to the control of applicant quotas, integrating advanced security and interactive documentation.

---

## Core Features

-   **User Management**: Support for **Admin**, **Gestor**, and **Coder** roles.
-   **Advanced Security**:
    -   Authentication via **JWT** (JSON Web Tokens).
    -   Additional protection through **API Key**.
    -   Password hashing with **Bcrypt**.
-   **Vacancy Management**: Full CRUD, activation/inactivation, and filtering by technologies.
-   **Application System**: Automatic validation of maximum quotas and application limits.
-   **Modern Infrastructure**:
    -   Containers with **Docker** and **Docker Compose**.
    -   PostgreSQL 17 Database.
    -   **Swagger UI** for API documentation and testing.
-   **Standardization**: Uniform format for all API responses using global interceptors.

---

## Tech Stack

-   **Framework**: [NestJS](https://nestjs.com/) (Node.js)
-   **Language**: TypeScript
-   **Database**: PostgreSQL
-   **ORM**: TypeORM
-   **Documentation**: Swagger (OpenAPI 3.1)
-   **Containers**: Docker & Docker Compose
-   **Testing**: Jest
-   **Code Quality**: ESLint & Prettier

---

## Environment Configuration

### 1. Environment Variables

Copy the example file and adjust the necessary values:

```bash
cp .env.example .env
```

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | Port the application runs on | `3000` |
| `DB_HOST` | Database host | `localhost` or `db` (Docker) |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | User password | `yourpassword` |
| `DB_DATABASE` | Database name | `empleability_db` |
| `JWT_SECRET` | Secret key for signing tokens | `your_super_secure_secret` |
| `JWT_EXPIRES_IN`| Token expiration time | `24h` |
| `API_KEY` | Global key for headers | `your_api_key` |

---

## Installation and Execution

### Option A: With Docker (Recommended)

Start the entire stack (App + DB + PgAdmin) with a single command:

```bash
docker-compose up --build
```

-   **API**: `http://localhost:3000`
-   **PgAdmin**: `http://localhost:8080` (User: `admin@admin.com`, Pass: `admin`)

### Option B: Local Execution

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Prepare the Database**:
    Ensure PostgreSQL is running and create the database defined in your `.env`.
3.  **Run Seeder** (Optional - Loads master data):
    ```bash
    npm run build
    npm run seed
    ```
4.  **Start**:
    ```bash
    # Development (Hot reload)
    npm run start:dev

    # Production
    npm run build
    npm run start:prod
    ```

---

## API Documentation

Access the **Swagger** interactive console at:

👉 [http://localhost:3000/api](http://localhost:3000/api)

### Endpoint Security

Many endpoints require authentication. In Swagger, click **Authorize** and provide:
1.  **Bearer Token**: The JWT obtained when logging in (`/api/auth/login`).
2.  **API Key**: The value defined in the `API_KEY` variable of your environment.

---

## Project Structure

```bash
src/
├── applications/   # Application management and quota validation
├── auth/           # Security logic (Guards, Strategies, JWT)
├── common/         # Decorators, enums, and response interceptors
├── database/       # Base entities and seeding scripts
├── users/          # Profile and role management (Admin, Gestor, Coder)
├── vacancies/      # Vacancy and technology management
├── app.module.ts   # Root module
└── main.ts         # Entry point and global configuration
```

---

## Quality and Testing

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Coverage
npm run test:cov

# Linter
npm run lint
```

---

## Security and Standardization

-   **ValidationPipe**: All input data is automatically validated and transformed according to DTOs.
-   **ResponseTransformInterceptor**: Ensures the client receives a consistent JSON object with `data` and `message` structure.
-   **RolesGuard**: Granular access control based on the authenticated user's role.

---
Generated with ❤️ for the SENA/Riwi program.

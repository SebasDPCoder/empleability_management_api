# Empleability Management API

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23C0E12F?style=for-the-badge&logo=swagger&logoColor=black)

Sistema de gestión integral para vacantes laborales y postulaciones de coders en el programa **Riwi**. Esta API robusta permite administrar el ciclo de vida de una vacante, desde su publicación hasta el control de cuotas de postulantes, integrando seguridad avanzada y documentación interactiva.

---

## Características Principales

-   **Gestión de Usuarios**: Soporte para roles de **Admin**, **Gestor** y **Coder**.
-   **Seguridad Avanzada**:
    -   Autenticación vía **JWT** (JSON Web Tokens).
    -   Protección adicional mediante **API Key**.
    -   Hasheo de contraseñas con **Bcrypt**.
-   **Gestión de Vacantes**: CRUD completo, activación/inactivación y filtrado por tecnologías.
-   **Sistema de Postulaciones**: Validación automática de cupos máximos y límites de aplicación.
-   **Infraestructura Moderna**:
    -   Contenedores con **Docker** y **Docker Compose**.
    -   Base de Datos PostgreSQL 17.
    -   **Swagger UI** para documentación y pruebas de API.
-   **Estandarización**: Formato uniforme para todas las respuestas de la API mediante interceptores globales.

---

## Stack Tecnológico

-   **Framework**: [NestJS](https://nestjs.com/) (Node.js)
-   **Lenguaje**: TypeScript
-   **Base de Datos**: PostgreSQL
-   **ORM**: TypeORM
-   **Documentación**: Swagger (OpenAPI 3.1)
-   **Contenedores**: Docker & Docker Compose
-   **Pruebas**: Jest
-   **Calidad de Código**: ESLint & Prettier

---

## ⚙️ Configuración del Entorno

### 1. Variables de Entorno

Copia el archivo de ejemplo y ajusta los valores necesarios:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor Ejemplo |
| :--- | :--- | :--- |
| `PORT` | Puerto en el que corre la aplicación | `3000` |
| `DB_HOST` | Host de la base de datos | `localhost` o `db` (Docker) |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USERNAME` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña del usuario | `yourpassword` |
| `DB_DATABASE` | Nombre de la base de datos | `empleability_db` |
| `JWT_SECRET` | Clave secreta para firmar tokens | `mi_secreto_super_seguro` |
| `JWT_EXPIRES_IN`| Tiempo de vida del token | `24h` |
| `API_KEY` | Clave global para headers | `tu_api_key` |

---

## 🚀 Instalación y Ejecución

### Opción A: Con Docker (Recomendado) 🐳

Levanta todo el stack (App + DB + PgAdmin) con un solo comando:

```bash
docker-compose up --build
```

-   **API**: `http://localhost:3000`
-   **PgAdmin**: `http://localhost:8080` (User: `admin@admin.com`, Pass: `admin`)

### Opción B: Ejecución Local

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```
2.  **Preparar la Base de Datos**:
    Asegúrate de tener PostgreSQL corriendo y crea la base de datos definida en tu `.env`.
3.  **Ejecutar Seeder** (Opcional - Carga datos maestros):
    ```bash
    npm run build
    npm run seed
    ```
4.  **Iniciar**:
    ```bash
    # Desarrollo (Hot reload)
    npm run start:dev

    # Producción
    npm run build
    npm run start:prod
    ```

---

## 📚 Documentación de la API

Accede a la consola interactiva de **Swagger** en:

👉 [http://localhost:3000/api](http://localhost:3000/api)

### Seguridad en los Endpoints

Muchos endpoints requieren autenticación. En Swagger, haz clic en **Authorize** y proporciona:
1.  **Bearer Token**: El JWT obtenido al loguearse (`/api/auth/login`).
2.  **API Key**: El valor definido en la variable `API_KEY` de tu entorno.

---

## 📂 Estructura del Proyecto

```bash
src/
├── applications/   # Gestión de postulaciones y validación de cupos
├── auth/           # Lógica de seguridad (Guards, Strategies, JWT)
├── common/         # Decoradores, enums e interceptores de respuesta
├── database/       # Entidades base y scripts de seeding
├── users/          # Administración de perfiles y roles (Admin, Gestor, Coder)
├── vacancies/      # Gestión de vacantes y tecnologías
├── app.module.ts   # Módulo raíz
└── main.ts         # Punto de entrada y configuración global
```

---

## 🧪 Calidad y Pruebas

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Cobertura
npm run test:cov

# Linter
npm run lint
```

---

## 🛡️ Seguridad y Estandarización

-   **ValidationPipe**: Todos los datos de entrada son validados y transformados automáticamente según los DTOs.
-   **ResponseTransformInterceptor**: Garantiza que el cliente reciba un objeto JSON con estructura `data` y `message` consistente.
-   **RolesGuard**: Control de acceso granular según el rol del usuario autenticado.

---
Generado con ❤️ para el programa SENA/Riwi.

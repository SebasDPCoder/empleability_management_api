# Empleability Management API

API REST construida con **NestJS**, **TypeORM** y **PostgreSQL** para gestionar vacantes de empleabilidad y postulaciones de coders del programa Riwi.

---

## 🧰 Requisitos previos

- Node.js >= 18
- npm >= 9
- PostgreSQL >= 14

---

## ⚙️ Configuración inicial

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd empleability_management_api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

Edita `.env` con tus datos:

```env
PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_DATABASE=empleability_db

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# API Key
API_KEY=your_api_key_here
```

### 4. Crear la base de datos en PostgreSQL

```sql
CREATE DATABASE empleability_db;
```

### 5. Ejecutar el seeder (datos maestros)

```bash
npm run seed
```

---

## 🚀 Ejecutar el proyecto

```bash
# Modo desarrollo (hot-reload)
npm run start:dev

# Modo normal
npm run start

# Modo producción (requiere build previo)
npm run build
npm run start:prod
```

La API estará disponible en: `http://localhost:3000`

---

## 📚 Documentación Swagger

Una vez levantada la app, accede a la documentación interactiva en:

```
http://localhost:3000/api
```

Todos los endpoints están documentados con ejemplos de request/response.

### Autenticación en Swagger

Los endpoints protegidos requieren **dos headers simultáneos**:

| Header | Valor |
|---|---|
| `Authorization` | `Bearer <token>` (JWT obtenido en `/api/auth/login`) |
| `x-api-key` | Valor definido en `API_KEY` del `.env` |

---

## 🗂️ Módulos disponibles

| Tag | Prefijo | Descripción |
|---|---|---|
| **Auth** | `/api/auth` | Registro e inicio de sesión |
| **Users** | `/api/users` | Gestión de usuarios |
| **Vacancies** | `/api/vacancies` | Gestión de vacantes |
| **Applications** | `/api/applications` | Postulaciones a vacantes |

---

## 🧪 Pruebas

```bash
# Ejecutar todos los unit tests
npm run test

# Modo watch (re-ejecuta al guardar)
npm run test:watch

# Reporte de cobertura
npm run test:cov

# Tests end-to-end
npm run test:e2e
```

---

## 🛠️ Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run start:dev` | Servidor en modo desarrollo con hot-reload |
| `npm run build` | Compila el proyecto a `/dist` |
| `npm run start:prod` | Corre el build compilado |
| `npm run seed` | Inserta datos maestros en la BD |
| `npm run lint` | Linting con ESLint (auto-fix) |
| `npm run format` | Formato de código con Prettier |
| `npm run test` | Unit tests con Jest |
| `npm run test:cov` | Cobertura de tests |
| `npm run test:e2e` | Tests end-to-end |

---

## 📁 Estructura del proyecto

```
src/
├── auth/               # Autenticación (JWT + API Key)
│   ├── dto/
│   ├── guards/
│   └── strategies/
├── users/              # Módulo de usuarios
├── vacancies/          # Módulo de vacantes
├── applications/       # Módulo de postulaciones
├── common/             # Interceptores, pipes y utilidades compartidas
├── database/
│   └── seeders/        # Scripts de seed para datos maestros
├── app.module.ts
└── main.ts
```

---

## 🔐 Seguridad

- **JWT**: tokens de acceso con expiración configurable (`JWT_EXPIRES_IN`).
- **API Key**: header `x-api-key` requerido en todos los endpoints protegidos.
- **ValidationPipe global**: valida y transforma todos los DTOs; rechaza propiedades no declaradas.
- **ResponseTransformInterceptor**: estandariza el formato de todas las respuestas.

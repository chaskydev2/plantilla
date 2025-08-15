# CTB – Plantilla 1 (Landing + Admin)

![Stack](https://img.shields.io/badge/stack-Laravel_12%20%2B%20React_19%20%2B%20MySQL%20%2B%20Vite-informational?style=flat&logo=laravel&logoColor=white&color=FF2D20)

Plantilla base para proyectos con **Landing pública** y **Panel administrativo**.  
Monorepo con **Laravel** (server) + **React** (client). Pensada para reusar y clonar como boilerplate.

## 🚀 Tecnologías
**Frontend**
- Vite + React 19 (TypeScript)
- TailwindCSS + DaisyUI
- Axios

**Backend**
- Laravel 12
- Laravel Passport (OAuth2)
- Base de datos: **MySQL** (dev local, XAMPP) / **PostgreSQL o MySQL** (deploy, opcional)

## 📋 Requisitos

- Node.js 20.x
- PHP 8.2+
- PostgreSQL 14+
- Composer 2.5+

## 🛠️ Instalación

### 1. Clonar repositorio
```bash
git clone https://github.com/chaskydev2/plantilla.git
cd ctb-main
```

### 2. Backend
```bash
cd server
composer install
cp .env.example .env
```
Edita server/.env (ejemplo para XAMPP + MySQL):
```bash
APP_NAME=CTB
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_PORT=8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ctb_db
DB_USERNAME=root
DB_PASSWORD=
```

### Configurar Passport (ejecutar estos comandos en orden)
```bash
php artisan key:generate
php artisan migrate --seed
php artisan passport:install
```

### 3. Frontend
```bash
cd ../client
npm install
```

## 🚀 Comandos para Levantar el Proyecto

**En terminales SEPARADAS ejecutar:**

### Terminal 1 - Backend (Laravel)
```bash
cd server
php artisan serve
```
### Terminal 2 - Frontend (React)
```bash
cd client
npm run dev
```
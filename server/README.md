# CTB - Sistema Colegio de Topógrafos Cochabamba

![Stack](https://img.shields.io/badge/stack-Laravel_12%2BReact_19%2BPostgreSQL-informational?style=flat&logo=laravel&logoColor=white&color=FF2D20)

Aplicación web para la gestión administrativa del Colegio de Topógrafos.

## 🚀 Tecnologías Principales

**Frontend**  
✔ Vite + React 19 (TypeScript)  
✔ TailwindCSS + DaisyUI  
✔ Axios para API calls  

**Backend**  
✔ Laravel 12  
✔ PostgreSQL 14+  
✔ Laravel Passport (OAuth2)  

## 📋 Requisitos

- Node.js 20.x
- PHP 8.2+
- PostgreSQL 14+
- Composer 2.5+

## 🛠️ Instalación

### 1. Clonar repositorio
```bash
git clone https://gitlab.com/colegio-topografos-cochabamba/ctb.git
cd ctb

# 2. Backend
cd server
composer install
cp .env.example .env
php artisan key:generate

# Configurar Passport (ejecutar estos comandos en orden)
php artisan migrate --seed
php artisan passport:keys
php artisan passport:client --personal
# Cuando solicite el nombre, ingresar: PersonalAccessToken

# 3. Frontend
cd ../client
npm install


## 🚀 Comandos para Levantar el Proyecto

**En terminales SEPARADAS ejecutar:**

### Terminal 1 - Backend (Laravel)
```bash
cd server
php artisan serve

### Terminal 2 - Frontend (React)
```bash
cd client
npm run dev


php artisan  install api
1. Разверните переменные окружения

# Бэкенд

Файл `.env` в корне проекта:

```env
# Database settings
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_NAME=habit_tracker

# TypeORM settings
TYPEORM_SYNC=true  # В продакшене установите в false
DB_RETRY_ATTEMPTS=10
DB_RETRY_DELAY_MS=2000

# JWT settings
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

# Фронтенд

Файл `.env` в директории `frontend/` (опционально, если нужна кастомизация):

```env
# Базовый URL для API (по умолчанию: /api)
VITE_API_URL=/api

# В режиме разработки можно указать полный URL до API, например:
# VITE_API_URL=http://localhost:3001
```

2. Запустите приложение с помощью Docker Compose:
   ```bash
   sudo docker compose up --build -d
   ```
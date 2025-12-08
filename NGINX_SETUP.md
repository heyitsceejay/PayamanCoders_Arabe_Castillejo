# NGINX Setup Guide

## Overview
NGINX is configured as a reverse proxy for the WorkQit Next.js application with the following features:
- Rate limiting on API and auth endpoints
- Static file caching
- Security headers
- Gzip compression
- Health check endpoint

## Quick Start

### Development Mode
```bash
docker-compose -f docker-compose.dev.yml up -d
```
Access the app at: http://localhost

### Production Mode
```bash
docker-compose up -d
```

## Commands

### Start services
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# NGINX only
docker-compose logs -f nginx

# Next.js only
docker-compose logs -f nextjs
```

### Rebuild
```bash
# Production
docker-compose up -d --build

# Development
docker-compose -f docker-compose.dev.yml up -d --build
```

## Configuration Files

### `nginx/nginx.conf` (Production)
- Rate limiting: 10 req/s for API, 5 req/min for auth
- Static file caching (1 hour for /_next/static, 24 hours for images)
- Security headers enabled
- Gzip compression

### `nginx/nginx.dev.conf` (Development)
- No rate limiting
- WebSocket support for hot reload
- Minimal caching

## Rate Limiting

### API Endpoints (`/api/*`)
- Rate: 10 requests/second
- Burst: 20 requests

### Auth Endpoints (`/api/auth/*`)
- Rate: 5 requests/minute
- Burst: 3 requests

## Health Check
```bash
curl http://localhost/nginx-health
```

## Logs
NGINX logs are stored in `./nginx/logs/`:
- `access.log` - All requests
- `error.log` - Errors only

## Troubleshooting

### Port 80 already in use
```bash
# Windows - Find process using port 80
netstat -ano | findstr :80

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### View container status
```bash
docker-compose ps
```

### Restart NGINX only
```bash
docker-compose restart nginx
```

### Test NGINX config
```bash
docker-compose exec nginx nginx -t
```

## Next Steps
- Add SSL/TLS certificates for HTTPS
- Configure custom domain
- Add Redis for caching
- Add RabbitMQ for message queuing
